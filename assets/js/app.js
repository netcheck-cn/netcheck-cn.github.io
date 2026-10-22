
'use strict';
const $=(id)=>document.getElementById(id);
function status(id,message,kind='info'){const el=$(id);if(el){el.textContent=message;el.dataset.kind=kind;}}
function checkedAt(){return new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}
function text(id,value){const el=$(id);if(el)el.textContent=value??'—';}
function setBusy(id,busy){const el=$(id);if(el)el.disabled=busy;}
async function jsonFetch(url,opts={}){const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),9000);try{const r=await fetch(url,{...opts,signal:controller.signal,cache:'no-store'});if(!r.ok)throw new Error(r.status===429?'接口请求次数已达到上限（HTTP 429）':`接口返回 HTTP ${r.status}`);return await r.json();}finally{clearTimeout(timeout);}}
function validIP(value){const s=value.trim();if(!s)return false;const v4=s.split('.');if(v4.length===4&&v4.every(x=>/^\d{1,3}$/.test(x)&&Number(x)<=255&&(x==='0'||!x.startsWith('0'))))return true;if(!s.includes(':')||!/^[0-9a-fA-F:.]+$/.test(s))return false;try{const url=new URL('http://['+s+']/');return !!url.hostname;}catch{return false;}}
function ipScope(ip){
 // Public geolocation is inappropriate for special-use and local addresses.
 if(ip.includes(':')){
  const lower=ip.toLowerCase();
  if(lower==='::'||lower==='::1'||lower.startsWith('fe8')||lower.startsWith('fe9')||lower.startsWith('fea')||lower.startsWith('feb')||lower.startsWith('fc')||lower.startsWith('fd'))return '此 IPv6 地址属于本地、链路本地或唯一本地地址，不能查询公网归属地。';
  if(lower.startsWith('ff'))return 'IPv6 组播地址不能查询公网归属地。';
  if(/^2001:0?db8(?::|$)/.test(lower))return '这是用于技术文档示例的 IPv6 地址段（2001:db8::/32），不能作为普通公网地址查询。';
  if(lower.startsWith('::ffff:'))return '这是 IPv4 映射形式的 IPv6 地址，请直接输入实际 IPv4 地址查询。';
  return '';
 }
 const v=ip.split('.').map(Number),a=v[0],b=v[1],c=v[2];
 if(a===10||(a===172&&b>=16&&b<=31)||(a===192&&b===168))return '这是私有 IPv4 地址，只在局域网中使用，没有公网归属地。';
 if(a===127)return '这是环回地址，不代表公网出口。';
 if(a===0||a>=224||(a===169&&b===254)||(a===100&&b>=64&&b<=127)||(a===192&&b===0&&c===0)||(a===192&&b===0&&c===2)||(a===198&&(b===18||b===19))||(a===198&&b===51&&c===100)||(a===203&&b===0&&c===113)||(a===192&&b===88&&c===99))return '这是保留、测试或特殊用途 IPv4 地址，不适合查询普通公网归属地。';
 return '';
}
function validDomain(value){let s=value.trim().toLowerCase().replace(/\.$/,'');if(s.length>253||s.length<3||s.includes('://')||s.includes('/')||s.includes(':'))return false;return s.split('.').length>=2&&s.split('.').every(p=>p.length>0&&p.length<=63&&/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(p));}
function makeTable(target,headers,rows){let el=$(target);if(!el)return;el.replaceChildren();if(!rows.length){el.textContent='没有可显示的记录。';return;}const t=document.createElement('table'),thead=document.createElement('thead'),tr=document.createElement('tr');headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;tr.append(th);});thead.append(tr);t.append(thead);const tb=document.createElement('tbody');rows.forEach(row=>{const r=document.createElement('tr');row.forEach(v=>{const d=document.createElement('td');d.textContent=String(v??'—');r.append(d);});tb.append(r);});t.append(tb);el.append(t);}
async function copyValue(value){
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);return true;}}catch{}
 // Browsers without Clipboard API may still support selecting and copying text.
 const field=document.createElement('textarea');field.value=value;field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.append(field);
 try{field.select();return document.execCommand('copy');}catch{return false;}finally{field.remove();}
}
function wireCopy(id,get){const el=$(id);if(el)el.addEventListener('click',async()=>{const value=get();if(!value){el.textContent='暂无可复制的结果';setTimeout(()=>el.textContent='复制结果',2000);return;}const ok=await copyValue(value);el.textContent=ok?'已复制':'复制失败，请手动选择';setTimeout(()=>el.textContent='复制结果',2000);});}
async function getPublicIP(){
 const providers=[
  async()=>({ip:(await jsonFetch('https://api64.ipify.org?format=json')).ip,source:'api64.ipify.org'}),
  async()=>{const ip=await textFetch('https://icanhazip.com/');return {ip:ip.trim(),source:'icanhazip.com'};}
 ];
 let lastError;
 for(const get of providers){try{const data=await get();if(validIP(data.ip))return data;throw Error('接口返回无效 IP');}catch(e){lastError=e;}}
 throw lastError||Error('公网 IP 接口不可用');
}
async function textFetch(url){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8500);try{const response=await fetch(url,{signal:controller.signal,cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);return await response.text();}finally{clearTimeout(timer);}}

async function getCurrent(){setBusy('myip-retry',true);status('myip-status','正在获取公网出口 IP…');text('myip-address','正在查询…');text('myip-source','—');$('myip-location')?.replaceChildren();try{const d=await getPublicIP();text('myip-address',d.ip);status('myip-status','通过 '+d.source+' 获取出口 IP，正在查询归属地…','info');text('myip-source',d.source);try{await lookupLocation(d.ip,'myip-location','myip-status');}catch{ /* IP remains displayed when geolocation fails */ }}catch(e){text('myip-address','获取失败');status('myip-status','无法获取公网 IP。请检查网络或稍后重试：'+e.message,'error');}finally{setBusy('myip-retry',false);}}
function formatLoc(d){return [d.country,d.region,d.city].filter(Boolean).join(' · ')||'暂无归属地信息';}
async function lookupLocation(ip,containerId,statusId){try{const d=await jsonFetch('https://ipwho.is/'+encodeURIComponent(ip));if(d.success===false)throw Error(d.message||'查询失败');const detail=[['国家/地区',d.country],['省/州',d.region],['城市',d.city],['运营商 / 组织',d.connection?.isp],['ASN',d.connection?.asn],['时区',d.timezone?.id]];const el=$(containerId);if(el){el.replaceChildren();detail.forEach(([k,v])=>{if(v===undefined||v===null||v==='')return;const item=document.createElement('div');item.className='kv';const name=document.createElement('span');name.textContent=k;const value=document.createElement('strong');value.textContent=String(v);item.append(name,value);el.append(item);});}status(statusId,'查询完成 · '+checkedAt()+'（数据来源：ipwho.is）。IP 归属地是数据库估算，并非设备精确位置。','success');return d;}catch(e){status(statusId,'IP 已获取，但归属地暂时不可用：'+e.message,'error');throw e;}}
function initIP(){if($('myip-address')){getCurrent();$('myip-retry')?.addEventListener('click',getCurrent);wireCopy('copy-myip',()=>{const value=$('myip-address')?.textContent||'';return validIP(value)?value:'';});}const form=$('lookup-form');if(form){form.addEventListener('submit',async e=>{e.preventDefault();const ip=$('ip-input').value.trim();$('lookup-results').replaceChildren();text('lookup-ip','—');if(!validIP(ip)){status('lookup-status','请输入正确的 IPv4 或 IPv6 地址。','error');return;}const scope=ipScope(ip);if(scope){text('lookup-ip',ip);status('lookup-status',scope,'info');return;}setBusy('ip-search',true);status('lookup-status','正在查询…');text('lookup-ip',ip);try{await lookupLocation(ip,'lookup-results','lookup-status');}catch{}finally{setBusy('ip-search',false);}});wireCopy('copy-lookup',()=> $('lookup-results').querySelector('.kv') ? $('lookup-ip').textContent+' | '+[...$('lookup-results').querySelectorAll('.kv')].map(e=>e.textContent).join(' | ') : '');}}
function dnsDiagnosis(outcomes){
 const list=outcomes.filter(x=>x.status==='fulfilled').map(x=>x.value);
 if(!list.length)return '两个公共解析服务均未成功响应。请检查能否连接 DoH 接口，稍后重试；不能据此判断域名不存在。';
 const codes=list.map(x=>x.d.Status);
 if(codes.some(x=>x===2))return '出现 SERVFAIL：解析服务无法完成请求，可能与权威 DNS、DNSSEC 或临时故障有关。可稍后重试并检查权威 DNS 配置。';
 if(codes.every(x=>x===3))return '两个解析器均返回 NXDOMAIN：它们认为查询的域名不存在。先检查拼写和域名是否已生效。';
 if(codes.some(x=>x===3))return '解析器对域名是否存在的判断不一致。可能与缓存、域名变更传播或解析故障有关，建议间隔一段时间复查。';
 if(codes.some(x=>x!==0))return '有解析器返回非正常 DNS 状态。请查看每家服务的状态码，不要把 HTTP 请求失败混同于 DNS 错误。';
 if(list.every(x=>!(x.d.Answer||[]).length))return '解析器响应正常，但没有返回所选类型的 Answer 记录。这不代表域名没有其他 DNS 记录。';
 return '已获取 DNS 应答。记录不同可能是 CDN 地域调度、缓存及更新时间差异；不能直接据此判断 DNS 污染。';
}
const DNS_TYPES={A:1,NS:2,CNAME:5,SOA:6,MX:15,TXT:16,AAAA:28,CAA:257};
const DNS_NAMES=Object.fromEntries(Object.entries(DNS_TYPES).map(([k,v])=>[v,k]));
function dnsStatus(code){return ({0:'NOERROR（正常响应）',1:'FORMERR（格式错误）',2:'SERVFAIL（服务器失败）',3:'NXDOMAIN（域名不存在）',4:'NOTIMP（不支持）',5:'REFUSED（拒绝）'})[code]||`DNS 状态码 ${code}`;}
async function dnsQuery(provider,domain,type){const url=provider==='Google'?'https://dns.google/resolve?name='+encodeURIComponent(domain)+'&type='+type:'https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(domain)+'&type='+type;const headers=provider==='Cloudflare'?{'Accept':'application/dns-json'}:{};const t=performance.now();const d=await jsonFetch(url,{headers});if(!d||typeof d!=='object'||Array.isArray(d)||!Number.isInteger(d.Status)||d.Status<0||d.Status>15||(d.Answer!==undefined&&!Array.isArray(d.Answer)))throw Error('DNS 接口响应格式不正确');return {provider,d,ms:Math.round(performance.now()-t)};}
// Compare only Answer-section records; other response sections are not compared.
function answerSignature(response){
 const answers=Array.isArray(response?.Answer)?response.Answer:[];
 return JSON.stringify(answers.filter(a=>a&&typeof a==='object').map(a=>[
  Number(a.type),String(a.name??'').toLowerCase().replace(/\.$/,''),String(a.data??'').trim()
 ]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
}
function compareDnsAnswers(first,second){
 if(first.Status!==second.Status)return '两家解析器返回不同的 DNS 状态码；请分别检查响应。';
 return answerSignature(first)===answerSignature(second)
  ? '两家解析器的 DNS 状态码和 Answer 记录一致（忽略 TTL、记录顺序；未比较 Authority / Additional 等其他响应字段）。'
  : '两家解析器的 Answer 记录不同（或状态码不同）；可能是缓存、地域调度或记录更新，不能据此断定污染。';
}
function initDNS(){const form=$('dns-form');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const domain=$('dns-domain').value.trim().toLowerCase().replace(/\.$/,'');const type=$('dns-type').value;if(!validDomain(domain)){status('dns-status','请输入有效的 ASCII 域名，例如 example.com；中文域名请使用 Punycode 形式。','error');return;}setBusy('dns-search',true);$('copy-dns').disabled=true;status('dns-status','正在同时查询两家公共 DNS 服务…');$('dns-google').replaceChildren();$('dns-cloudflare').replaceChildren();text('dns-compare','等待结果');text('dns-diagnosis','等待查询结果。');try{const outcomes=await Promise.allSettled(['Google','Cloudflare'].map(p=>dnsQuery(p,domain,type)));const data=[];outcomes.forEach((out,i)=>{const p=['Google','Cloudflare'][i];const target=i===0?'dns-google':'dns-cloudflare';if(out.status==='rejected'){text(target,p+' 查询失败：'+out.reason.message);return;}const item=out.value;data.push(item);const rows=(Array.isArray(item.d.Answer)?item.d.Answer:[]).filter(a=>a&&typeof a==='object').map(a=>[a.name,DNS_NAMES[a.type]||a.type,a.TTL,a.data]);const block=$(target);const summary=document.createElement('p');summary.textContent=dnsStatus(item.d.Status)+' · HTTP 请求耗时 '+item.ms+' ms';block.append(summary);const tbl=document.createElement('div');tbl.className='results';tbl.id=target+'-table';block.append(tbl);makeTable(tbl.id,['名称','记录类型','TTL（秒）','记录值'],rows);if(!rows.length){const n=document.createElement('p');n.textContent=item.d.Status===0?'响应正常，但没有返回这种类型的 Answer 记录。':'请根据 DNS 状态检查域名与解析服务。';block.append(n);}});text('dns-diagnosis',dnsDiagnosis(outcomes));if(data.length===2){text('dns-compare',compareDnsAnswers(data[0].d,data[1].d));}else{text('dns-compare','只有一家服务返回有效响应，无法完成双服务对比。');}status('dns-status',data.length?'检测结束 · '+checkedAt()+'。以下均为 API 实际响应。':'两个 DNS 接口均不可访问，请稍后重试。',data.length?'success':'error');$('copy-dns').disabled=!data.length;}catch(e){status('dns-status','DNS 查询异常：'+e.message,'error');text('dns-compare','查询未完成');text('dns-diagnosis','请求发生异常，暂时不能判断域名解析情况。');$('copy-dns').disabled=true;}finally{setBusy('dns-search',false);}});wireCopy('copy-dns',()=> $('copy-dns').disabled?'':['dns-google','dns-cloudflare','dns-compare'].map((id,i)=>['Google DNS','Cloudflare DNS','结果比较'][i]+'：\n'+($(id)?.textContent||'')).join('\n\n'));}
const ENDPOINT='https://www.google.com/generate_204'; // no-cors: measures fetch settlement, not a verified HTTP response
async function httpProbe(){const c=new AbortController();const timer=setTimeout(()=>c.abort(),7000);const t=performance.now();try{await fetch(ENDPOINT+'?test='+Date.now()+'-'+Math.random().toString(36).slice(2),{mode:'no-cors',cache:'no-store',signal:c.signal});return Math.round(performance.now()-t);}finally{clearTimeout(timer);}}
function initLatency(){const btn=$('latency-start');if(!btn)return;btn.addEventListener('click',async()=>{setBusy('latency-start',true);try{status('latency-status','正在测试（共 5 次 HTTP 请求），请勿切换网络…');const samples=[];const attempts=[];['latency-avg','latency-median','latency-range','latency-success'].forEach(id=>text(id,'—'));$('latency-chart').replaceChildren();for(let i=0;i<5;i++){try{const ms=await httpProbe();samples.push(ms);attempts.push({ok:true,ms});status('latency-status',`第 ${i+1}/5 次 fetch 已结束：${ms} ms（HTTP 状态不可见）`);}catch(e){attempts.push({ok:false});status('latency-status',`第 ${i+1}/5 次请求失败：${e.message}`,'error');}await new Promise(r=>setTimeout(r,220));}if(samples.length){const sorted=[...samples].sort((a,b)=>a-b),avg=Math.round(samples.reduce((a,b)=>a+b,0)/samples.length),median=sorted.length%2?sorted[Math.floor(sorted.length/2)]:Math.round((sorted[sorted.length/2-1]+sorted[sorted.length/2])/2),range=Math.max(...samples)-Math.min(...samples);text('latency-avg',avg+' ms');text('latency-median',median+' ms');text('latency-range',range+' ms');text('latency-success',samples.length+'/5');const bars=$('latency-chart');bars.replaceChildren();attempts.forEach((entry,i)=>{const b=document.createElement('div');b.className='bar'+(entry.ok?'':' bar-failed');b.style.height=entry.ok?Math.max(8,Math.round(entry.ms/Math.max(...samples)*122))+'px':'8px';const label=document.createElement('small');label.textContent=entry.ok?entry.ms:'失败';b.title='第'+(i+1)+'次：'+(entry.ok?entry.ms+' 毫秒':'失败');b.append(label);bars.append(b);});bars.setAttribute('aria-label','5次请求耗时：'+attempts.map(a=>a.ok?a.ms+'毫秒':'失败').join('、')); status('latency-status',samples.length===5?'5 次 fetch 均已结束（测试端点：www.google.com/generate_204）。这些数字是浏览器 Fetch 请求结束耗时，可能受到连接、缓存策略及浏览器行为影响；no-cors 无法读取 HTTP 状态，也不能证明网站正常或代表 ICMP Ping。':`仅 ${samples.length}/5 次请求完成。失败请求未计入耗时统计；无法读取 HTTP 状态码，也不能据此判断宽带速度。`,samples.length===5?'success':'info');}else{text('latency-success','0/5');status('latency-status','测试未取得有效数据；浏览器或网络可能阻止测试端点访问。','error');}}catch(e){status('latency-status','检测过程中出现错误：'+(e?.message||'未知错误'),'error');}finally{setBusy('latency-start',false);}});}
document.addEventListener('DOMContentLoaded',()=>{initIP();initDNS();initLatency();});


// Dual-stack checks use forced-address-family hostnames. Failure does not prove protocol unsupported.
async function familyIP(family){
 const url=family===4?'https://api4.ipify.org?format=json':'https://api6.ipify.org?format=json';
 const d=await jsonFetch(url);
 if(!d||!validIP(d.ip)||(family===4?d.ip.includes(':'):!d.ip.includes(':')))throw Error('接口未返回预期的地址类型');
 return d.ip;
}
function initDualStack(){const btn=$('dualstack-start');if(!btn)return;btn.addEventListener('click',async()=>{
 btn.disabled=true;text('ipv4-result','检测中…');text('ipv6-result','检测中…');text('dualstack-note','两个独立请求正在执行，最长约 9 秒。');
 try{const results=await Promise.allSettled([familyIP(4),familyIP(6)]);
 results.forEach((r,i)=>{text(i===0?'ipv4-result':'ipv6-result',r.status==='fulfilled'?r.value:'暂未检测到');});
 text('dualstack-note',results.every(r=>r.status==='fulfilled')?'两种协议的出口地址均已获取。':'部分请求失败。可能是当前网络未支持该协议，也可能是服务不可达、浏览器策略或网络拦截；不能仅据此确认协议支持状况。');}catch(error){text('dualstack-note','检测异常：'+error.message);}finally{btn.disabled=false;}
 });}
// Compact overview; each query is real, not inferred from another record type.
function initDNSBatch(){const btn=$('dns-batch-start');if(!btn)return;btn.addEventListener('click',async()=>{
 const domain=$('dns-domain')?.value.trim().toLowerCase().replace(/\.$/,'')||'';
 if(!validDomain(domain)){status('dns-batch-status','请先输入有效的 ASCII 域名。','error');return;}
 btn.disabled=true;status('dns-batch-status','正在查询六类常见 DNS 记录…');$('dns-batch-results').replaceChildren();
 try{const types=['A','AAAA','MX','NS','TXT','CAA'];const results=await Promise.allSettled(types.map(type=>dnsQuery('Google',domain,type)));
 const rows=results.map((r,i)=>{if(r.status==='rejected')return [types[i],'请求失败',r.reason?.message||'未知错误'];const x=r.value;const answer=Array.isArray(x.d.Answer)?x.d.Answer.filter(a=>a&&typeof a==='object'):[];const matching=answer.filter(a=>a.type===DNS_TYPES[types[i]]);const preview=x.d.Status!==0?'查询返回非正常 DNS 状态':matching.length?matching.slice(0,3).map(a=>String(a.data).slice(0,240)+(String(a.data).length>240?'…':'' )).join('；')+(matching.length>3?'（其余 '+(matching.length-3)+' 条未展开）':''):answer.length?'返回了别的记录类型（如 CNAME），请查看单项详情':'未返回此类型记录';return [types[i],dnsStatus(x.d.Status),preview];});
 makeTable('dns-batch-results',['类型','状态','概览'],rows);
 const failed=results.filter(r=>r.status==='rejected').length;
 status('dns-batch-status',`已完成 ${types.length} 类记录的查询；${failed} 类请求失败。结果来自 Google Public DNS，可能受到缓存和地域影响。`,failed?'info':'success');}catch(error){status('dns-batch-status','批量查询出现意外错误：'+error.message,'error');}finally{btn.disabled=false;}
 });}
document.addEventListener('DOMContentLoaded',()=>{initDualStack();initDNSBatch();});


// IPinfo Lite country-level bulk lookup. No city or region fields exist in Lite.
function initBatchIP(){
 const single=$('lookup-form'),pane=$('batch-pane');if(!single||!pane)return;
 const copyButton=$('copy-lookup');let records=[],running=false;
 const token=String(window.NETCHECK_IPINFO_TOKEN||'').trim();
 const activate=batch=>{
  if(running)return;
  pane.hidden=!batch;single.hidden=batch;
  const note=single.nextElementSibling;
  for(const id of ['lookup-status','lookup-ip','lookup-results']){const el=$(id);if(el)el.hidden=batch;}
  if(copyButton?.closest('.actions'))copyButton.closest('.actions').hidden=batch;
  if(note?.classList.contains('note'))note.hidden=batch;
  $('mode-single').setAttribute('aria-pressed',String(!batch));$('mode-batch').setAttribute('aria-pressed',String(batch));
 };
 $('mode-single').addEventListener('click',()=>activate(false));
 $('mode-batch').addEventListener('click',()=>activate(true));
 const display=()=>makeTable('batch-results',['IP 地址','查询状态','国家/地区','洲','ASN','网络组织'],records.map(r=>[r.ip,r.state,r.country,r.continent,r.asn,r.organization]));
 if(!token){$('batch-start').disabled=true;status('batch-status','批量查询服务尚未启用。单个 IP 查询仍可正常使用。','info');}
 const batchLimit=50;
 $('batch-start').addEventListener('click',async()=>{
  if(running)return;
  if(!token){status('batch-status','批量查询服务尚未启用，请使用单个查询。','error');return;}
  const ips=[...new Set($('batch-ip-input').value.split(/[\n,;，；]+/).map(x=>x.trim()).filter(Boolean))];
  if(!ips.length){status('batch-status','请至少输入一个 IP 地址。','error');return;}
  if(ips.length>batchLimit){status('batch-status',`每批最多 ${batchLimit} 个不同 IP，请分批处理。`,'error');return;}
  running=true;records=ips.map(ip=>({ip,state:'等待',country:'—',continent:'—',asn:'—',organization:'—'}));
  $('batch-export').disabled=true;$('batch-start').disabled=true;
  $('mode-single').disabled=true;$('mode-batch').disabled=true;$('batch-progress').style.width='0%';display();
  let cursor=0,finished=0;
  const update=()=>{display();$('batch-progress').style.width=(finished/ips.length*100)+'%';status('batch-status',`已处理 ${finished}/${ips.length} 个 IP；成功 ${records.filter(x=>x.state==='查询成功').length} 个。`,finished===ips.length?'success':'info');};
  const worker=async()=>{
   while(cursor<ips.length){
    const index=cursor++,ip=ips[index],record=records[index];
    if(!validIP(ip)){record.state='地址格式错误';finished++;update();continue;}
    const scope=ipScope(ip);
    if(scope){record.state=scope;finished++;update();continue;}
    record.state='查询中';update();
    try{
     const url='https://api.ipinfo.io/lite/'+encodeURIComponent(ip)+'?token='+encodeURIComponent(token);
     const d=await jsonFetch(url);
     if(!d||typeof d!=='object'||Array.isArray(d)||!d.ip||d.error)throw Error(d?.error?.message||'返回数据不完整');
     record.state='查询成功';
     record.country=String(d.country||d.country_code||'—');
     record.continent=String(d.continent||d.continent_code||'—');
     record.asn=String(d.asn||'—');
     record.organization=String(d.as_name||d.as_domain||'—');
    }catch(e){record.state=e.name==='AbortError'?'请求超时':('查询失败：'+(e.message||'服务暂不可用'));}
    finished++;update();
   }
  };
  try{await Promise.all(Array.from({length:Math.min(3,ips.length)},()=>worker()));}
  catch(e){status('batch-status','批量任务发生异常：'+(e.message||'未知错误'),'error');}
  finally{running=false;$('batch-start').disabled=false;$('mode-single').disabled=false;$('mode-batch').disabled=false;$('batch-export').disabled=!records.length;}
 });
 $('batch-clear').addEventListener('click',()=>{if(running)return;$('batch-ip-input').value='';records=[];$('batch-export').disabled=true;$('batch-results').replaceChildren();$('batch-progress').style.width='0%';status('batch-status','已清空。');});
 $('batch-export').addEventListener('click',()=>{
  if(!records.length)return;
  const csvCell=v=>'"'+String(v??'').replace(/"/g,'""').replace(/^[=+@\-\t\r]/,x=>"'"+x)+'"';
  const rows=[['IP 地址','查询状态','国家/地区','洲','ASN','网络组织'],...records.map(r=>[r.ip,r.state,r.country,r.continent,r.asn,r.organization])];
  const csv='\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='网测通-IP批量查询.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
}
document.addEventListener('DOMContentLoaded',initBatchIP);
