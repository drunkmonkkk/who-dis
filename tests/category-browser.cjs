const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
// Real metadata API and home/setup UI. This check does not create database rooms.
(async()=>{
 const base=process.env.BASE_URL||'http://localhost:3001';
 const response=await fetch(base+'/api/game');assert.equal(response.status,200);
 assert.match(response.headers.get('cache-control'),/no-store/);
 const meta=await response.json();assert.equal(meta.knowledgeVersion,'reviewed-decks-v3');assert.ok(meta.catalogCount>=40);
 const categories=['Bollywood','Cricket','Football','Writers','India'];
 for(const c of categories)assert.ok(meta.availableCategories.includes(c),c);
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 fs.mkdirSync('work/category-preview',{recursive:true});
 const checks=[];
 for(const width of [1440,900,390]){
  const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  const packs=page.locator('.deck-index .pack');assert.equal(await packs.count(),9);
  for(const pack of await packs.all())assert.ok(await pack.isEnabled());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  await page.screenshot({path:`work/category-preview/decks-${width}.png`,fullPage:true});
  const titles=['Off-script in Mumbai','Beyond the boundary','Off the pitch','Between the lines','The India files'];
  for(let i=0;i<categories.length;i++){
   await packs.filter({hasText:titles[i]}).click();
   assert.equal(await page.getByRole('combobox',{name:'PICK YOUR SUSPECT POOL'}).inputValue(),categories[i]);
   assert.equal(await page.locator('option').filter({hasText:categories[i]}).getAttribute('disabled'),null);
   await page.getByRole('button',{name:'Close dialog'}).click();
  }
  assert.deepEqual(errors,[]);checks.push({width,decks:9,categorySetup:categories});await page.close();
 }
 await browser.close();
 fs.writeFileSync('work/category-browser-verification.json',JSON.stringify({origin:base,metadata:meta,checks},null,2));
 console.log('Category metadata, all nine decks, five setup selections and 1440/900/390px layouts PASS at '+base);
})().catch(e=>{console.error(e);process.exit(1)});
