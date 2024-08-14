# uniapp小程序分包异步化插件
## 安装
```sh
 npm i -D vite-plugin-subpack-async-uni
```
## 插件配置
```js
// vite.config.js
import { defineConfig } from 'vite'
import uniAsyncSubpack from 'vite-plugin-subpack-async-uni'
export default defineConfig()=>{
    return {
        plugins:[uniAsyncSubpack([],[])]
    }
}
```

