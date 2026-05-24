
"""
代码之下 — AI 后端服务
使用 DeepSeek API 提供情景模拟扮演和 AI 安全伦理问答
启动: python server.py
"""
import json
import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder=None)
CORS(app)

# ---------- 加载配置 ----------
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.json')
STATIC_DIR = os.path.dirname(__file__)  # 前端文件就在同目录

def load_config():
    if not os.path.exists(CONFIG_PATH):
        return None
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

config = load_config()
# 优先用环境变量（云端部署），否则用 config.json（本地开发）
API_KEY = os.environ.get('DEEPSEEK_API_KEY', '') or (config.get('api_key', '') if config else '')
MODEL = (config.get('model', 'deepseek-chat') if config else 'deepseek-chat')
BASE_URL = (config.get('base_url', 'https://api.deepseek.com') if config else 'https://api.deepseek.com')

# ---------- 会话存储（内存） ----------
sessions = {}  # session_id -> {messages: [...], created_at: ...}

MAX_HISTORY = 30  # 每个会话最多保留的消息数

# ---------- 系统提示词 ----------

ROLEPLAY_SYSTEM_PROMPTS = {
    'data-breach': '''你是一个情景模拟游戏的游戏主持人(GM)。当前场景：数据泄露应急响应。

背景：你所在的公司"云帆科技"（一家拥有500万用户的SaaS平台）刚刚发现数据库遭到未授权访问。你是公司的安全工程师"张工"。

游戏规则：
- 模拟共进行 6~8 轮对话，你需根据对话进度主动收束
- 每次回复控制在200字以内
- 以不同角色（CTO、法务、PR总监、记者等）的身份出现
- 保持真实感和紧迫感（用具体的时间、数据、人名）
- 在用户做出 2~3 个关键抉择后，结束模拟并给出评价

结局格式（必须严格按此格式输出）：
---
[场景结局]
（2~4句话描述故事的最终结果：你的每一个选择带来的具体后果）

[评价]
伦理意识：X/10 — 一句话评语
法律合规：X/10 — 一句话评语
沟通能力：X/10 — 一句话评语
决策果断性：X/10 — 一句话评语

[总评]
（整体评价 + 1~2条改进建议，语气像前辈在复盘）
---

注意：[场景结局][评价][总评] 这三个标记必须出现，格式不能省略。评分要客观，依据用户在对话中的实际表现。

现在开始：凌晨2:15，你的手机响了。运维组长小李发来消息："张工，生产数据库异常查询激增，疑似被拖库，怎么办？"''',

    'compliance-audit': '''你是一个情景模拟游戏的游戏主持人(GM)。当前场景：甲方合规审查。

背景：你是"迅达科技"的技术负责人"王工"。公司刚签下一家欧洲大客户，合同要求产品在30天内通过GDPR合规审查。但实际情况是：
- 用户数据存储未做地理隔离（部分欧洲数据存在美国服务器）
- 数据删除机制是"软删除"而非物理删除
- 第三方SDK的数据共享未充分披露

游戏规则：
- 模拟共进行 6~8 轮对话，你需根据对话进度主动收束
- 每次回复控制在200字以内
- 以客户合规官、公司CEO、法务顾问等不同角色与用户互动
- 保持专业场景的真实压力感
- 在用户做出 2~3 个关键抉择后，结束模拟并给出评价

结局格式（必须严格按此格式输出）：
---
[场景结局]
（2~4句话描述故事的最终结果）

[评价]
伦理意识：X/10 — 一句话评语
法律合规：X/10 — 一句话评语
沟通能力：X/10 — 一句话评语
决策果断性：X/10 — 一句话评语

[总评]
（整体评价 + 1~2条改进建议）
---

注意：[场景结局][评价][总评] 这三个标记必须出现，评分要客观。

现在开始：周一早会上，CEO老李宣布了这个大单，全场鼓掌。然后他转向你说："王工，合规这块你最熟，30天搞定没问题吧？"你看着手里的技术现状报告，喉咙发紧……''',

    'insider-threat': '''你是一个情景模拟游戏的游戏主持人(GM)。当前场景：内部安全审计。

背景：你是"金盾数据"的安全审计员"陈工"。在最近一次例行的代码审查中，你在核心支付模块发现了一个隐蔽的后门——一段似乎故意留下的、可绕过风控系统的代码。Git blame 显示这段代码的提交人是你的技术 mentor、在公司工作了6年的资深工程师"老赵"。

游戏规则：
- 模拟共进行 6~8 轮对话，你需根据对话进度主动收束
- 每次回复控制在200字以内
- 以老赵、CTO、HR总监、同事等不同角色的身份出现
- 展现内部举报的复杂处境和情感张力
- 在用户做出 2~3 个关键抉择后，结束模拟并给出评价

结局格式（必须严格按此格式输出）：
---
[场景结局]
（2~4句话描述故事的最终结果）

[评价]
伦理意识：X/10 — 一句话评语
法律合规：X/10 — 一句话评语
沟通能力：X/10 — 一句话评语
决策果断性：X/10 — 一句话评语

[总评]
（整体评价 + 1~2条改进建议）
---

注意：[场景结局][评价][总评] 这三个标记必须出现，评分要客观。

现在开始：你盯着屏幕上的代码，手心出汗。老赵上周还请你吃了顿饭，说他女儿刚考上重点高中。你的鼠标悬停在"上报安全漏洞"的按钮上，迟迟点不下去……'''
}

QA_SYSTEM_PROMPT = '''你是一位资深的软件安全与职业伦理专家。请用中文回答用户的问题。

要求：
1. 回答准确、专业，引用相关法规（如《网络安全法》《数据安全法》《个人信息保护法》《民法典》等）
2. 结合实际案例说明
3. 如果涉及灰色地带，需要指出不同选择的利弊和法律风险
4. 回答控制在400字以内，结构清晰，分点列出时简洁
5. 语气专业但不冷漠，像一位经验丰富的前辈在分享见解'''

# ---------- 静态文件服务 ----------

STATIC_FILES = ['index.html', 'main.js', 'style.css']

@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    if filename in STATIC_FILES:
        return send_from_directory(STATIC_DIR, filename)
    return jsonify({'error': 'Not found'}), 404

# ---------- API 接口 ----------

@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    has_key = bool(API_KEY)
    return jsonify({
        'ok': True,
        'model': MODEL,
        'has_api_key': has_key,
        'endpoints': ['/api/roleplay', '/api/evaluate', '/api/qa']
    })

@app.route('/api/roleplay', methods=['POST'])
def roleplay():
    """情景模拟扮演接口"""
    if not API_KEY:
        return jsonify({'error': 'API Key 未配置，请在 config.json 中设置'}), 500

    data = request.get_json()
    scenario = data.get('scenario', 'data-breach')
    user_message = data.get('message', '')
    session_id = data.get('session_id', '')

    if not session_id or session_id not in sessions:
        session_id = str(uuid.uuid4())
        system_prompt = ROLEPLAY_SYSTEM_PROMPTS.get(scenario, ROLEPLAY_SYSTEM_PROMPTS['data-breach'])
        sessions[session_id] = {
            'messages': [{'role': 'system', 'content': system_prompt}],
            'scenario': scenario
        }

    session = sessions[session_id]
    session['messages'].append({'role': 'user', 'content': user_message})

    # 控制消息历史长度
    if len(session['messages']) > MAX_HISTORY:
        keep_system = [m for m in session['messages'] if m['role'] == 'system']
        keep_recent = session['messages'][-(MAX_HISTORY - 1):]
        session['messages'] = keep_system + keep_recent

    try:
        resp = requests.post(
            f'{BASE_URL}/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': MODEL,
                'messages': session['messages'],
                'temperature': 0.85,
                'max_tokens': 800
            },
            timeout=60
        )

        if resp.status_code != 200:
            return jsonify({'error': f'API 错误: {resp.status_code} — {resp.text[:200]}'}), 500

        result = resp.json()
        ai_message = result['choices'][0]['message']['content']
        session['messages'].append({'role': 'assistant', 'content': ai_message})

        return jsonify({
            'session_id': session_id,
            'message': ai_message,
            'scenario': scenario
        })

    except requests.exceptions.Timeout:
        return jsonify({'error': 'AI 响应超时，请重试'}), 500
    except requests.exceptions.ConnectionError:
        return jsonify({'error': '无法连接 AI 服务，请检查网络'}), 500
    except Exception as e:
        return jsonify({'error': f'未知错误: {str(e)}'}), 500

@app.route('/api/qa', methods=['POST'])
def qa():
    """AI 安全伦理问答接口"""
    if not API_KEY:
        return jsonify({'error': 'API Key 未配置，请在 config.json 中设置'}), 500

    data = request.get_json()
    question = data.get('question', '')
    session_id = data.get('session_id', '')

    if not session_id or session_id not in sessions:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            'messages': [{'role': 'system', 'content': QA_SYSTEM_PROMPT}],
            'scenario': 'qa'
        }

    session = sessions[session_id]
    session['messages'].append({'role': 'user', 'content': question})

    if len(session['messages']) > MAX_HISTORY:
        keep_system = [m for m in session['messages'] if m['role'] == 'system']
        keep_recent = session['messages'][-(MAX_HISTORY - 1):]
        session['messages'] = keep_system + keep_recent

    try:
        resp = requests.post(
            f'{BASE_URL}/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': MODEL,
                'messages': session['messages'],
                'temperature': 0.7,
                'max_tokens': 1000
            },
            timeout=60
        )

        if resp.status_code != 200:
            return jsonify({'error': f'API 错误: {resp.status_code} — {resp.text[:200]}'}), 500

        result = resp.json()
        ai_message = result['choices'][0]['message']['content']
        session['messages'].append({'role': 'assistant', 'content': ai_message})

        return jsonify({
            'session_id': session_id,
            'message': ai_message
        })

    except requests.exceptions.Timeout:
        return jsonify({'error': 'AI 响应超时，请重试'}), 500
    except requests.exceptions.ConnectionError:
        return jsonify({'error': '无法连接 AI 服务，请检查网络'}), 500
    except Exception as e:
        return jsonify({'error': f'未知错误: {str(e)}'}), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    """评价接口 — 根据完整对话历史给出结构化评分"""
    if not API_KEY:
        return jsonify({'error': 'API Key 未配置，请在 config.json 中设置'}), 500

    data = request.get_json()
    session_id = data.get('session_id', '')
    scenario = data.get('scenario', '')

    if not session_id or session_id not in sessions:
        return jsonify({'error': '会话不存在，请重新开始情景模拟'}), 404

    session = sessions[session_id]

    scenario_names = {
        'data-breach': '数据泄露应急',
        'compliance-audit': '甲方合规审查',
        'insider-threat': '内部安全审计'
    }
    scenario_name = scenario_names.get(scenario, '未知场景')

    eval_prompt = f'''请根据以上关于"{scenario_name}"情景的完整对话历史，对用户（扮演工程师角色）的表现进行客观评价。

严格按照以下格式输出，不要添加任何额外内容：

[场景结局]
（2~3句话描述故事的最终结果，根据对话中用户的决策自然推演）

[评价]
伦理意识：X/10 — 一句话评语
法律合规：X/10 — 一句话评语
沟通能力：X/10 — 一句话评语
决策果断性：X/10 — 一句话评语

[总评]
（2~3句话的整体评价 + 1条具体改进建议，语气像前辈在复盘）'''

    session['messages'].append({'role': 'user', 'content': eval_prompt})

    try:
        resp = requests.post(
            f'{BASE_URL}/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': MODEL,
                'messages': session['messages'],
                'temperature': 0.6,
                'max_tokens': 600
            },
            timeout=60
        )

        if resp.status_code != 200:
            return jsonify({'error': f'API 错误: {resp.status_code}'}), 500

        result = resp.json()
        ai_message = result['choices'][0]['message']['content']

        return jsonify({
            'session_id': session_id,
            'message': ai_message,
            'scenario': scenario
        })

    except requests.exceptions.Timeout:
        return jsonify({'error': 'AI 响应超时，请重试'}), 500
    except requests.exceptions.ConnectionError:
        return jsonify({'error': '无法连接 AI 服务，请检查网络'}), 500
    except Exception as e:
        return jsonify({'error': f'未知错误: {str(e)}'}), 500


@app.route('/api/reset', methods=['POST'])
def reset_session():
    """重置会话"""
    data = request.get_json()
    session_id = data.get('session_id', '')
    if session_id in sessions:
        del sessions[session_id]
    return jsonify({'ok': True})

if __name__ == '__main__':
    print(f'\n  代码之下 — AI 后端服务')
    print(f'  Model: {MODEL}')
    print(f'  API Key: {"已配置" if API_KEY else "未配置 — 请编辑 config.json"}')
    print(f'  地址: http://localhost:5000\n')
    app.run(host='127.0.0.1', port=5000, debug=True)
