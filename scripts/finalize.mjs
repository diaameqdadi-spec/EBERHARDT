import fs from 'node:fs/promises';
const d=JSON.parse(await fs.readFile('content.json','utf8'));
const replacements=[[/href="[^"\n]*AppointmentRequest\.aspx"/gi,'href="/appointment-request/"'],[/href="[^"\n]*Contact\.aspx"/gi,'href="/contact/"'],[/href="[^"\n]*DentalVideos\.aspx"/gi,'href="/dental-videos/"'],[/href="\/Procedures\.aspx"/gi,'href="/procedures/"']];
for(const p of d.pages){for(const [from,to] of replacements)p.html=p.html.replace(from,to);p.links=[...p.html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:m[1],label:m[2].replace(/<[^>]*>/g,'').trim()}));}
const home=d.pages.find(p=>p.path==='/');if(!d.pages.some(p=>p.path==='/welcome/'))d.pages.push({...home,path:'/welcome/',title:'Welcome to Eberhardt Dental'});
const ada=d.pages.find(p=>p.path==='/ada.aspx');ada.title='Accessibility';ada.html='<h2>Care and information for everyone</h2><p>Use the navigation and the complete site directory to explore our practice and patient education resources. You can increase text size with your browser’s zoom controls (Ctrl + plus on Windows, or Command + plus on Mac). This redesigned site supports keyboard navigation and reduced motion preferences.</p><p>If you need help accessing any information, call <a href="tel:+15704242445">(570) 424-2445</a>. Our team is happy to help.</p><p><a href="/site-directory/">Browse the complete site directory</a></p>';
const review=d.pages.find(p=>p.path==='/reviews/post-a-review/');review.html='<p>The original review submission form is supplied by Dental Ratings Network.</p><p><a href="https://www.eberhardtdental.com/reviews/post-a-review/">Open the practice’s review page</a></p>';
d.errors=[];d.notes=['Post-a-review content is a third-party script; the redesigned page links to the original review form.','Original ADA page repeats homepage content with text-size controls; redesign provides accessibility guidance.','Submission forms use the practice’s existing website; no patient data is stored by this local preview.'];
await fs.writeFile('content.json',JSON.stringify(d,null,2));
let js=await fs.readFile('app.js','utf8');js=js.replace('src="/assets/hero.jpg" alt="A patient smiling comfortably during a dental visit"','src="/assets/smile.jpg" alt="A warm, confident smile"');
js=js.replace("if(path==='/smile-analysis/')content=handoff", "if(path==='/smile-analysis/')content=handoff");
js=js.replace("+p.html.replace(/<input", "+p.html.replace(/<label\\b[^]*?<\\/label>/gi,'').replace(/<input");
await fs.writeFile('app.js',js);
console.log('Finalized',d.pages.length,'local content routes.');
