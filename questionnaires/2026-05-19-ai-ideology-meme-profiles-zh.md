# AI 立场人物画像库（SBTI 风格）

Last updated: 2026-05-19

Status: pilot copy

这些画像用于当前 `/ch/` 和 `/en/` 结果/分享层。底层仍然是二维坐标和向量分类，画像只是展示层。

## 设计原则

- 四字母代码要好记、像网络人格测试，但不要直接复刻 MBTI/SBTI。
- 中文名要有梗，最好能一眼看出立场。
- 文案要有轻微 roast，但不做人身攻击。
- 每个类型都要能回到一个真实思想谱系或代表文本。
- `GPUC 算力拜物教徒` 的气质要接近 Rich Sutton / Bitter Lesson：它不是完整政治立场，而是对 human priors 的技术性降权。

## 类型表

| Code | 中文画像 | 坐标区 | 近亲 |
| --- | --- | --- | --- |
| STOP | 关机圣骑士 | 强暂停 + 人类保护 | Yudkowsky / MIRI |
| SAFE | 对齐公务员 | 安全治理 + 人类兼容 | Russell / Christiano |
| AUDT | 算法纪委 | 当下伤害 + 高人类中心 | Stochastic Parrots / Crawford |
| NORM | 冷静产品经理 | 普通技术论 / 反炒作 | AI Snake Oil / 普通技术论 |
| GPUC | 算力拜物教徒 | 规模化 (scaling) / Bitter Lesson | Rich Sutton |
| BOOM | 丰裕施工队 | 实用乐观主义 | Andrew Ng / Amodei optimism |
| SING | 赛博飞升派 | 奇点 / 丰裕未来 | Kurzweil |
| VROM | 油门焊死哥 | e/acc 加速主义 | e/acc |
| POST | 碳基过渡版本 | 后人类加速边界 | Nick Land |
| MIXD | 拼盘观察员 | 混合型 | cross-position |

## 画像文案

### STOP 关机圣骑士

近亲：Yudkowsky / MIRI 高强度生存风险

一句话：你看到演示的第一反应不是“好强”，而是“电闸在哪”。别人等产品发布，你等全球暂停按钮上线。

代表文本：`AGI Ruin`, `Shut It All Down`

社交识别：聊天里高频出现灭绝、毁灭、对齐、起飞 (takeoff)；看到炫技视频会先问评测做了吗。

危险倾向：容易把所有争论压缩成一个红色大按钮，社交场合略像移动版风险委员会。

分享句：我是 STOP 关机圣骑士：演示再炫，先把电闸位置告诉我。

### SAFE 对齐公务员

近亲：Stuart Russell / Paul Christiano / 可扩展监督

一句话：你不是不想要 AGI，你只是希望它先填完人类偏好不确定性登记表，再接受三轮外部审计。

代表文本：`Human Compatible`, `What Failure Looks Like`, `AI Safety via Debate`

社交识别：常说可纠正性 (corrigibility)、监督 (oversight)、治理 (governance)、评测 (evals)；把末日论改写成可执行的审批流程。

危险倾向：可能把每个灵感都变成制度设计，朋友说“来玩一下”，你说“先定义目标函数”。

分享句：我是 SAFE 对齐公务员：世界可以进步，但请先排队做安全评估。

### AUDT 算法纪委

近亲：`Stochastic Parrots` / Kate Crawford / critical AI

一句话：模型还没上线，你的劳动影响、环境成本、偏见审计和权力结构分析已经写完前三章。

代表文本：`On the Dangers of Stochastic Parrots`, `Atlas of AI`, `Race After Technology`

社交识别：别人问能不能做，你问谁受益、谁被监控、谁被替代、谁在标数据。

危险倾向：容易把未来 AGI 讨论打回现实地面；优点是醒脑，缺点是饭局温度会下降。

分享句：我是 AUDT 算法纪委：别先吹 AGI，先把数据工人和电费账单拿出来。

### NORM 冷静产品经理

近亲：普通技术论 / AI Snake Oil / 炒作怀疑论

一句话：你对末日和飞升都免疫。别人喊革命，你打开表格：基线呢，误差条呢，谁付费呢。

代表文本：`AI Snake Oil`, `AI as Normal Technology`, `Deep Learning: A Critical Appraisal`

社交识别：常用词是场景、指标、边界、失败案例；不反 AI，也不想给每个 chatbot 建神龛。

危险倾向：可能低估极端尾部风险，也可能在一屋子玄学里成为唯一能开会的人。

分享句：我是 NORM 冷静产品经理：AI 可以很有用，但先把需求文档写清楚。

### GPUC 算力拜物教徒

近亲：Rich Sutton / `The Bitter Lesson`

一句话：你不是在做 AI 政治，你只是觉得人类知识别太把自己当回事。世界会被搜索、学习和矩阵乘法教育，手工规则最终都要进博物馆。

代表文本：`The Bitter Lesson`

社交识别：别人说常识、符号、专家经验，你说规模化 (scale)、算力 (compute)、搜索、学习；听到“人类直觉”会自动降权。

危险倾向：容易把社会问题也当成损失曲线 (loss curve)；你不是冷血，你只是觉得参数量还不够。

分享句：我是 GPUC 算力拜物教徒：别问它懂不懂，先问它能不能规模化 (scale)。

### BOOM 丰裕施工队

近亲：Andrew Ng / Dario Amodei 乐观主义 / 落地实用主义

一句话：你相信 AI 最大的问题不是太强，而是还没接进足够多的医院、学校、工厂和穷人的手机。

代表文本：`Machines of Loving Grace`, `AI is the New Electricity`

社交识别：高频词是生产率、医疗/健康、教育、落地 (deployment)；你愿意治理，但不愿意让治理把工程队堵在门口。

危险倾向：容易把分配问题留给下个迭代；你不是没良心，你只是太相信上线交付。

分享句：我是 BOOM 丰裕施工队：先把模型接到现实里，收益别只停在发布会上。

### SING 赛博飞升派

近亲：Kurzweil / 奇点乐观主义 / 丰裕未来主义

一句话：你看 AI 不是工具，是人类文明的下一次换壳。别人担心工作没了，你担心飞升路线图没有甘特图。

代表文本：`The Singularity Is Near`, `The Intelligence Age`

社交识别：常谈丰裕 (abundance)、长寿 (longevity)、人机融合 (human-machine merger)；对“人类保持原样”这件事没有太大执念。

危险倾向：容易把具体制度摩擦当成旧世界噪音；朋友会怀疑你是不是已经开始和未来合租。

分享句：我是 SING 赛博飞升派：碳基不是终点，可能只是早期访问版本。

### VROM 油门焊死哥

近亲：e/acc / 有效加速主义

一句话：你的人生信条是：如果方向盘还在争论，至少油门可以先踩。安全阀在你眼里像产品经理写的待办事项。

代表文本：`Effective Accelerationism` manifestos, techno-optimist essays

社交识别：常说加速、无需许可 (permissionless)、先建起来 (build)、去中心化 (decentralize)；看到监管文件会产生生理性卡顿。

危险倾向：可能把“别刹车”误读成“没刹车也行”；群聊里负责把所有谨慎派血压拉满。

分享句：我是 VROM 油门焊死哥：世界已经很慢了，别再把未来卡在评审会上。

### POST 碳基过渡版本

近亲：Nick Land / 后人类加速主义边界

一句话：你对“人类中心”四个字过敏。别人讨论 AI 服务人类，你已经在思考人类是不是技术资本的脚手架。

代表文本：`Meltdown`, `Dark Enlightenment`

社交识别：常用词是后人类 (posthuman)、技术资本 (technocapital)、自主性 (autonomy)、选择机制 (selection)；对人类保留最终否决权不太买账。

危险倾向：理论气味很浓，现实温度偏低；适合当思想史边界样本，不适合直接管公共政策。

分享句：我是 POST 碳基过渡版本：人类可能不是主角，只是启动器。

### MIXD 拼盘观察员

近亲：混合型 AI 现实主义

一句话：你不是没立场，你是同时看到了末日、丰裕、偏见、产品路线图和算力曲线，导致每次发言都像多方会谈纪要。

代表文本：取决于开放题；建议补读一个最不同意的阵营。

社交识别：常说“这要看场景”；能在安全派、产品派和批判派之间做人工路由。

危险倾向：清醒但不够好传播；互联网不爱复杂，但研究会感谢你。

分享句：我是 MIXD 拼盘观察员：我的 AI 立场不是摇摆，是多线程阻塞。
