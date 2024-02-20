export default {
    async fetch(request, env) {
        let url = new URL(request.url);

        // ���path���ȴ���1������Ŀ����վ�������ṩindex.html
        if (url.pathname.length>1) {
			// ��ϣ�������󷴴�����Ŀ������
			url.hostname = "github.com";
			// ɾ��path�е�"https://github.com/"�ַ�����֧�ַ�������url
			url.pathname = url.pathname.replace("https://github.com/", "");
			url.pathname = url.pathname.replace("https:/github.com/", ""); //�ض�������ϲ�����//

			// ����һ���µ�������󣬰���ԭʼ�����������Ϣ
			let new_request = new Request(url, request);
			// �������󲢵ȴ���Ӧ
			let response = await fetch(new_request);
			
			// �����ض�����Ӧ
			if (response.status === 302 || response.status === 301) {
				// ��ȡ�ض����URL
				let location = response.headers.get("Location");

				// ����Location����������
				url = new URL(location);
				new_request=new Request(url,request);
				return fetch(new_request);
			}
			
			// ���ض�����Ӧֱ�ӷ���
			return response;
        }
        // �����ṩ��̬�ʲ���
        return env.ASSETS.fetch(request);
    }
  };
