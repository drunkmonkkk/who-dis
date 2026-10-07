import type {Metadata} from 'next';import './globals.css';
const origin=process.env.APP_URL||'http://localhost:3000';
export const metadata:Metadata={metadataBase:new URL(origin),title:'WHO DIS?',description:'Ask smart. Guess early. Regret publicly.',icons:{icon:'/favicon.svg'},openGraph:{title:'WHO DIS?',description:'Ask smart. Guess early. Regret publicly.',type:'website',images:[{url:'/social-preview.png',width:1200,height:630,alt:'WHO DIS? Ask smart. Guess early. Regret publicly.'}]},twitter:{card:'summary_large_image',title:'WHO DIS?',description:'Ask smart. Guess early. Regret publicly.',images:['/social-preview.png']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
