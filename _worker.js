export default {
    async fetch(request, env) {
        let url = new URL(request.url);

        // 如果path长度大于1，反代目标网站，否则提供index.html
        if (url.pathname.length>1) {
			// 你希望将请求反代到的目标域名
			url.hostname = "github.com";
			// 删除path中的"https://github.com/"字符串以支持反代完整url
			url.pathname = url.pathname.replace("https://github.com/", "");
			url.pathname = url.pathname.replace("https:/github.com/", ""); //重定向规则会合并两个//

			// 创建一个新的请求对象，包含原始请求的所有信息
			let new_request = new Request(url, request);
			// 发送请求并等待响应
			let response = await fetch(new_request);
			
			// 处理重定向响应
			if (response.status === 302 || response.status === 301) {
				// 获取重定向的URL
				let location = response.headers.get("Location");

				// 根据Location构造新请求
				url = new URL(location);
				new_request=new Request(url,request);
				return fetch(new_request);
			}
			
			// 非重定向响应直接返回
			return response;
        }
        // 否则，提供静态资产。
        return env.ASSETS.fetch(request);
    }
  };
