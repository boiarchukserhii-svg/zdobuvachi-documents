(() => {
 const buttons=[document.getElementById('install'),document.getElementById('install-login')].filter(Boolean);
 const help=document.getElementById('install-help'),close=document.getElementById('install-help-close');let deferredPrompt=null;
 const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const update=()=>buttons.forEach(button=>{button.hidden=installed();button.disabled=false;});
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;update();});
 window.addEventListener('appinstalled',()=>{deferredPrompt=null;buttons.forEach(button=>button.hidden=true);if(help.open)help.close();});
 async function install(){if(installed())return;if(!deferredPrompt){help.showModal();return;}const prompt=deferredPrompt;deferredPrompt=null;buttons.forEach(button=>button.disabled=true);try{await prompt.prompt();await prompt.userChoice;}catch{help.showModal();}finally{update();}}
 buttons.forEach(button=>button.onclick=install);close.onclick=()=>help.close();
 const link=document.getElementById('install-link');link.value=new URL('./',location.href).href;
 document.getElementById('copy-install-link').onclick=async()=>{try{await navigator.clipboard.writeText(link.value);document.getElementById('install-copy-status').textContent='Посилання скопійовано. Вставте його в адресний рядок Chrome.';}catch{link.focus();link.select();document.getElementById('install-copy-status').textContent='Виділіть і скопіюйте посилання з цього поля.';}};
 if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol)){let reloading=false;const controlled=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!reloading){reloading=true;location.reload();}});navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});}
 update();
})();
