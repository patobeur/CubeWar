"use strict";
let nbMess = 0;
// ------------------------ -----
class ChatBotFactory {
	constructor() {
		this.isChatFocused = false
		// local Datas
		// this.messages = {
		// 	0: {
		// 		mess: 'Bonjour !',
		// 		type: 'text',
		// 		id: 'Bot',
		// 		time: 0
		// 	}
		// }
		// Targets
		this.addCss(this.get_cssString(), 'chatbit')
		// store current bot question
		this.botQuestionsStack = { id: false, name: false, sentence: false }
		this.pendingQuestionsStack = { id: false, name: false, sentence: false }
		// tempo datas
		this.temporaryName = 'User'

		// check if first comming ?
		this.icons = { bot: '💡', me: '🕹️' }//🧙

		this.chatInput = document.getElementById('chatput')
		this.chatDiv = document.getElementById('chat-container')
		this.submitActionDiv = document.getElementById('chatbit')
		this.biggerActionDiv = document.getElementById('bigger')
		this.fixchatActionDiv = document.getElementById('fixchat')
		this.clearStorageActionDiv = document.getElementById('clearstorage')
		// local Datas
		this.chatSize = { num: 0, sizes: ['sm', 'md', 'xl'] };
		// this.chatDiv.classList.add(this.chatSize[this.chatSize.num].sizes)

		// Targets Listeners	
		this.submitActionDiv.addEventListener('click', this.checkSend, false)
		this.biggerActionDiv.addEventListener('click', this.get_biggerChatSize)
		this.fixchatActionDiv.addEventListener('click', this.get_fixedChat, false)
		this.clearStorageActionDiv.addEventListener('click', this.clearStorage, false)
		this.chatInput.addEventListener('focus', () => { this.chatin(true) }, false)
		this.chatInput.addEventListener('focusout', () => { this.chatin(false) }, false)
		// this.is_known()
		this.set_ChatSize()
	}
	chatin = (bool) => {
		// console.log('chatin', bool)
		this.isChatFocused = bool
	}
	is_known = () => {
		let mls_user = localStorage.getItem('mls_user')
		if (mls_user) {
			// console.log('welcome back ! ' + mls_user)
			this.add_message('welcome back ! ' + mls_user, 'text')
		} else {
			// localStorage.setItem('mls_user', this.temporaryName)
			// console.log('need profil creation ! ')
			this.add_message('New around ? what is your name ?', 'text')
			this.botQuestionsStack = { id: 1, name: [true], sentence: ' is your name ? (y/n)', answers: { 'y': 'save', 'n': 'exit' } }
		}
	}
	clearStorage = () => {
		this.redirect_clear_Storage();
	}
	get_fixedChat = () => {
		this.chatDiv.classList.contains('open') ? this.chatDiv.classList.remove('open') : this.chatDiv.classList.add('open')
		this.fixchatActionDiv.classList.contains('active') ? this.fixchatActionDiv.classList.remove('active') : this.fixchatActionDiv.classList.add('active')
	}
	set_ChatSize = () => {
		this.chatDiv.classList.add(this.chatSize.sizes[this.chatSize.num])
	}
	get_biggerChatSize = (eve) => {
		this.chatDiv.classList.remove(this.chatSize.sizes[this.chatSize.num])
		this.chatSize.num = (this.chatSize.num < this.chatSize.sizes.length - 1) ? this.chatSize.num + 1 : 0
		this.chatDiv.classList.add(this.chatSize.sizes[this.chatSize.num])
	}
	add_message = (content, type, who = 'bot', uid = false, sentence = false) => {
		// need to be cleaned 
		// need to be cleaned 
		let cleancontent = content // need to be cleaned 
		let cleantype = type // need to be cleaned 
		let cleanwho = who // need to be cleaned 
		// need to be cleaned 
		// need to be cleaned 
		// ---
		let newcontentDiv = document.createElement('div')
		newcontentDiv.className = cleantype
		newcontentDiv.textContent = this.icons[who] + nbMess + ':' + cleancontent
		// ---
		let newmessDiv = document.createElement('div')
		newmessDiv.id = 'mess-' + nbMess
		newmessDiv.className = cleanwho
		newmessDiv.appendChild(newcontentDiv)
		// ---
		let targetDiv = document.getElementById('messages-box')
		targetDiv.prepend(newmessDiv)
		// ---
		// document.getElementById('chat-container').classList.add('active')
		// ---
		nbMess++
		setTimeout(this.set_chatOff, 5000, 'test')
	}
	checkSend = () => {
		let intputValue = this.chatInput.value
		if (intputValue.length > 0) {
			this.reroot_add_message(intputValue, 'text', 'me')
			this.chatInput.value = ""
		}
	}
	checkEnterKey = () => {
		if (this.chatInput.matches(':focus')) {
			this.checkSend()
		}
	}
	set_chatOff = (content = "vide") => {
		document.getElementById('chat-container').classList.remove('active')
	}

	redirect_clear_Storage = () => { console.log('clear_Storage'); localStorage.clear(); }

	regex_input = (value) => { return value.replaceAll(/[&/\\#,+()$~%.^'":*?<>{}]/g, "*"); }
	// ---

	reroot_add_message = (content, type, who, uid) => {
		// EXPERIMENTAL BUG
		content = this.regex_input(content)
		this.add_message(content, type, who, uid)
		// check respons correlation
		if (this.botQuestionsStack.name && this.botQuestionsStack.sentence && this.botQuestionsStack.name[0]) {
			localStorage.setItem('mls_user', content)
			this.add_message(content + ", " + this.botQuestionsStack.sentence, 'text')
			this.botQuestionsStack = { id: 2, name: [true], sentence: ' Oops sorry ' + content + ' i can\'t save this right now... Class is pretty broken and Dev is ... ? Well ! Don\'t know where he is !?!. Just Empty [🔨] your localStorage and refresh [F5] to clear your name.', answers: { y: '', n: '' } }
			// setTimeout(() => { this.add_message('see you later !!!', 'text') }, 5000, false)
			// setTimeout(() => { document.getElementById('chat-container').remove() }, 7000, false)
		}
	}
	addCss(stringcss, styleid) {
		let style = document.createElement('style');
		style.textContent = stringcss
		style.id = styleid
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	get_cssString() {
		return '*,::before,::after {margin: 0;	padding: 0;	-webkit-user-select: none; /* Safari */	-moz-user-select: none; /* irefox /	-ms-user-select: none; /* IE10+/Edge */	user-select: none; /* Standard */box-sizing: border-box;}@font-face {font-family: "quikhand";src: url("../fonts/quikhand/Quikhand.ttf") format("truetype");} body #chat-container {position: fixed;bottom: 0.5rem;right: 0.5rem;border-radius: 0.5rem;width: 2rem;min-width: -webkit-min-content;min-width: -moz-min-content;min-width: min-content;height: calc(2.5rem + 4px);max-height: 200px;background-color: white;border: 2px solid #0a2944;overflow: hidden;display: -ms-grid;display: grid;-ms-grid-columns: 1fr;    grid-template-columns: 1fr;-ms-grid-rows: 2.5rem 1fr 3rem;    grid-template-rows: 2.5rem 1fr 3rem;-webkit-transition: height 1s ease-in, width 1s ease-in;transition: height 1s ease-in, width 1s ease-in;color: white;background-color: rgba(0, 0, 0, 0.192); } body #chat-container button {border: none;margin: 0;padding: 0;width: auto;overflow: visible;background: transparent;/* inherit font & color from ancestor */color: inherit;font: inherit;/* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */line-height: normal;/* Corrects font smoothing for webkit */-webkit-font-smoothing: inherit;-moz-osx-font-smoothing: inherit;/* Corrects inability to style clickable `input` types in iOS */-webkit-appearance: none;/* Remove excess padding and border in Firefox 4+ */ }  body #chat-container button::-moz-focus-inner {border: 0;padding: 0; }  body #chat-container button {border: 2px solid #ffffff;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;    -ms-flex-align: center;        align-items: center;-webkit-box-pack: center;    -ms-flex-pack: center;        justify-content: center;font-size: 1.3rem; }  body #chat-container .chat-header {-ms-grid-column: 1;grid-column: 1;-ms-grid-row: 1;grid-row: 1;background-color: #1978f0;display: -ms-grid;display: grid;-ms-grid-columns: 1fr;    grid-template-columns: 1fr;-ms-grid-rows: 1fr;    grid-template-rows: 1fr; }  body #chat-container .chat-header .chatlogo {-ms-grid-column: 1;grid-column: 1;-ms-grid-row: 1;grid-row: 1;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-pack: start;    -ms-flex-pack: start;        justify-content: flex-start;-webkit-box-align: center;    -ms-flex-align: center;        align-items: center;font-size: 1.85rem;line-height: 100%;height: 100%;padding: 0 0.5rem; }  body #chat-container .chat-header .size, body #chat-container .chat-header .pins, body #chat-container .chat-header .tools {display: none; }  body #chat-container .messages {-ms-grid-column: 1;grid-column: 1;-ms-grid-row: 2;grid-row: 2;background-color: rgba(255, 255, 255, 0.411);display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;    -ms-flex-direction: column;        flex-direction: column;-webkit-box-align: unset;    -ms-flex-align: unset;        align-items: unset;overflow: hidden;font-size: 1rem;scrollbar-width: thin; }  body #chat-container .messages .bot, body #chat-container .messages .me {width: 100%;height: -webkit-max-content;height: -moz-max-content;height: max-content;max-width: 100%;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;    -ms-flex-direction: column;        flex-direction: column;-webkit-box-align: end;    -ms-flex-align: end;        align-items: flex-end;padding: 0.2rem 0.5rem; }  body #chat-container .messages .bot .text, body #chat-container .messages .me .text {position: relative;width: -webkit-max-content;width: -moz-max-content;width: max-content;height: -webkit-max-content;height: -moz-max-content;height: max-content;max-width: 100%;text-align: right;background-color: rgba(14, 69, 141, 0.849);border-radius: 0.5rem;padding: 0.2rem 0.5rem;margin-bottom: 0.5rem;border: 1px solid black; }  body #chat-container .messages .bot .text:after, body #chat-container .messages .me .text:after {position: absolute;top: calc(100% - 0.5rem);right: 16px;content: url(../../../../themes/default/assets/svg/phyl_bot_b.svg);width: 16px;height: 16px; }  body #chat-container .messages .me {-webkit-box-align: start;    -ms-flex-align: start;        align-items: flex-start;-ms-flex-item-align: start;    align-self: flex-start; }  body #chat-container .messages .me .text {text-align: left;background-color: rgba(18, 141, 14, 0.849); }  body #chat-container .messages .me .text:after {right: unset;left: 13px;content: url(../assets/svg/phyl_me_b.svg); }  body #chat-container:hover, body #chat-container.active, body #chat-container.open {width: 250px;height: 80%;-webkit-transition: height 0.5s ease, width 0.5s ease;transition: height 0.5s ease, width 0.5s ease; }  body #chat-container:hover .chat-header, body #chat-container.active .chat-header, body #chat-container.open .chat-header {-ms-grid-columns: 1fr 2.5rem 2.5rem 2.5rem;    grid-template-columns: 1fr 2.5rem 2.5rem 2.5rem;-ms-grid-rows: 1fr;    grid-template-rows: 1fr; }  body #chat-container:hover .chat-header .chatlogo, body #chat-container.active .chat-header .chatlogo, body #chat-container.open .chat-header .chatlogo {background-color: transparent;height: 100%; }  body #chat-container:hover .chat-header .size, body #chat-container:hover .chat-header .pins, body #chat-container:hover .chat-header .tools, body #chat-container.active .chat-header .size, body #chat-container.active .chat-header .pins, body #chat-container.active .chat-header .tools, body #chat-container.open .chat-header .size, body #chat-container.open .chat-header .pins, body #chat-container.open .chat-header .tools {height: 100%;-ms-grid-column: 2;grid-column: 2;-ms-grid-row: 1;grid-row: 1;display: initial; }  body #chat-container:hover .chat-header .size button, body #chat-container:hover .chat-header .pins button, body #chat-container:hover .chat-header .tools button, body #chat-container.active .chat-header .size button, body #chat-container.active .chat-header .pins button, body #chat-container.active .chat-header .tools button, body #chat-container.open .chat-header .size button, body #chat-container.open .chat-header .pins button, body #chat-container.open .chat-header .tools button {width: 100%;height: 100%;border: 0; }  body #chat-container:hover .chat-header .size button:hover, body #chat-container:hover .chat-header .pins button:hover, body #chat-container:hover .chat-header .tools button:hover, body #chat-container.active .chat-header .size button:hover, body #chat-container.active .chat-header .pins button:hover, body #chat-container.active .chat-header .tools button:hover, body #chat-container.open .chat-header .size button:hover, body #chat-container.open .chat-header .pins button:hover, body #chat-container.open .chat-header .tools button:hover {background-color: rgba(159, 160, 230, 0.877);border: 0;text-shadow: 0 0 3px rgba(0, 0, 0, 0.719); }  body #chat-container:hover .chat-header .size button.active, body #chat-container:hover .chat-header .pins button.active, body #chat-container:hover .chat-header .tools button.active, body #chat-container.active .chat-header .size button.active, body #chat-container.active .chat-header .pins button.active, body #chat-container.active .chat-header .tools button.active, body #chat-container.open .chat-header .size button.active, body #chat-container.open .chat-header .pins button.active, body #chat-container.open .chat-header .tools button.active {background-color: green;border: 0; }  body #chat-container:hover .chat-header .pins, body #chat-container.active .chat-header .pins, body #chat-container.open .chat-header .pins {-ms-grid-column: 3;grid-column: 3; }  body #chat-container:hover .chat-header .tools, body #chat-container.active .chat-header .tools, body #chat-container.open .chat-header .tools {-ms-grid-column: 4;grid-column: 4; }  body #chat-container:hover.sm, body #chat-container.active.sm, body #chat-container.open.sm {width: 250px;height: 250px;max-height: 100%; }  body #chat-container:hover.sm .messages .me .text, body #chat-container:hover.sm .messages .bot .text, body #chat-container.active.sm .messages .me .text, body #chat-container.active.sm .messages .bot .text, body #chat-container.open.sm .messages .me .text, body #chat-container.open.sm .messages .bot .text {font-size: 1.2rem; }  body #chat-container:hover.sm .messages .me .text:after, body #chat-container:hover.sm .messages .bot .text:after, body #chat-container.active.sm .messages .me .text:after, body #chat-container.active.sm .messages .bot .text:after, body #chat-container.open.sm .messages .me .text:after, body #chat-container.open.sm .messages .bot .text:after {top: calc(100%); }  body #chat-container:hover.md, body #chat-container.active.md, body #chat-container.open.md {width: 400px;height: 500px;max-height: 80%; }  body #chat-container:hover.md .messages .me .text, body #chat-container:hover.md .messages .bot .text, body #chat-container.active.md .messages .me .text, body #chat-container.active.md .messages .bot .text, body #chat-container.open.md .messages .me .text, body #chat-container.open.md .messages .bot .text {font-size: 1.7rem; }  body #chat-container:hover.xl, body #chat-container.active.xl, body #chat-container.open.xl {width: 50%;height: 90%;max-height: 100%; }  body #chat-container:hover.xl .messages .me .text, body #chat-container:hover.xl .messages .bot .text, body #chat-container.active.xl .messages .me .text, body #chat-container.active.xl .messages .bot .text, body #chat-container.open.xl .messages .me .text, body #chat-container.open.xl .messages .bot .text {font-size: 2rem; }  body #chat-container:hover .messages {overflow-y: auto; }  body #chat-container.active {width: 300px;max-height: 100%; }  body #chat-container .chat-form {-ms-grid-column: 1;grid-column: 1;-ms-grid-row: 3;grid-row: 3; }  body #chat-container .chat-form .form-box {display: -ms-grid;display: grid;-ms-grid-columns: 1fr 50px;    grid-template-columns: 1fr 50px;-ms-grid-rows: 3rem;    grid-template-rows: 3rem; }  body #chat-container .chat-form .form-box .input {-ms-grid-column: 1;grid-column: 1;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;    -ms-flex-align: center;        align-items: center;-webkit-box-pack: right;    -ms-flex-pack: right;        justify-content: right;border-right: 0; }  body #chat-container .chat-form .form-box .input input {padding-left: 0.5rem;width: 98%;border: 2px solid #ffffff;border-right: 0;outline: unset;height: 80%;font-size: 1rem;border-radius: 0.5rem;border-top-right-radius: 0;border-bottom-right-radius: 0; }  body #chat-container .chat-form .form-box .input input:focus {border-color: #000000;outline: unset;border-right: 0; }  body #chat-container .chat-form .form-box .input input:focus:hover {border-color: #ffffff;outline: unset;background-color: black;color: white;-webkit-user-select: initial;   -moz-user-select: initial;    -ms-user-select: initial;        user-select: initial; }  body #chat-container .chat-form .form-box .input input:hover {border-color: #000000;outline: unset; }  body #chat-container .chat-form .form-box .submit {-ms-grid-column: 2;grid-column: 2;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;    -ms-flex-align: center;        align-items: center;-webkit-box-pack: left;    -ms-flex-pack: left;        justify-content: left; }  body #chat-container .chat-form .form-box .submit button#chatbit {width: 90%;height: 80%;border: 2px solid #ffffff;border-radius: 0.5rem;border-top-left-radius: 0;border-bottom-left-radius: 0;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;    -ms-flex-align: center;        align-items: center;-webkit-box-pack: center;    -ms-flex-pack: center;        justify-content: center;font-size: 1.3rem;background-color: rgba(0, 0, 0, 0.87); }  body .editable:hover {color: #eeff00;background-color: black;outline: 1px dashed black;padding: 0.5rem;border-radius: 0.5rem; }  body.nightmode .editable:hover {color: black;background-color: white;outline-color: #eeff00; }  body.nightmode #chat {color: black;background-color: rgba(255, 255, 255, 0.212); }  @media print {body #chat-container {  display: none;} }';
	}
	// submit_question = () => {
	// todo
	// }
	// clear_Storage = () => {
	// 	MyDataz.clear_Storage();
	// }
}
