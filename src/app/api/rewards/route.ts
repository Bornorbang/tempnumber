import { NextRequest, NextResponse } from "next/server";
const PHP=(process.env.NEXT_PUBLIC_API_URL??'').replace(/\/$/,'');
async function proxy(req:NextRequest){try{const body=req.method==='POST'?await req.text():undefined;const res=await fetch(`${PHP}/rewards/index.php`,{method:req.method,headers:{Authorization:req.headers.get('authorization')??'',...(body?{'Content-Type':'application/json'}:{})},body,cache:'no-store'});return NextResponse.json(await res.json(),{status:res.status,headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Could not load rewards.'},{status:502})}}
export const GET=proxy;export const POST=proxy;
