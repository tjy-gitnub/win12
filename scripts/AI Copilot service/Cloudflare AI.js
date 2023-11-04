import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Invalid method', { status: 405 });
    }

    const tasks = [];
    const ai = new Ai(env.AI);

    const body = await request.json(); 

    let chat = {
      messages: body.messages // 使用请求负载中的聊天记录
    };
    let response = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat);
    tasks.push({ inputs: chat, response });

    return new Response(JSON.stringify(tasks), { headers: { 'Content-Type': 'application/json' } });
  }
};
