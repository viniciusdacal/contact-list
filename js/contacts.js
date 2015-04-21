var Contacts = (function () {
	var listEl;
	var listItemEl;
	var contactCollection = [];

	//inicializar contatos.
	var init = function (selector) {
		listEl = document.querySelector(selector);
		listItemEl = listEl.querySelector('.list-item');
		formEl = listEl.querySelector('.form-item');

		//remove os dois templates do DOM.
		listEl.removeChild(listItemEl);
		listEl.removeChild(formEl);

		loadContacts();
	};

	//carregar contatos com ajax.
	var loadContacts = function () {
		var filePath = 'contactCollection.json';
		XHR.get(filePath, function (data) {
			contactCollection = JSON.parse(data);
			listContacts();
		});
	};

	//listar contatos no DOM.
	var listContacts = function (collection) {
		_cleanList();
		var collection = collection || contactCollection;
		var listItem = [];

		//cria um documentFragment em memória para inserir os elements
		//ganhamos performance fazendo desta forma.
		var docFragment = document.createDocumentFragment();
		collection.forEach(function (item, i) {
			var item = _loadContactTemplate(i, listItemEl);
			item.addEventListener('click', _onclickCallback);
			docFragment.appendChild(item);
			listItem.push(item);
		});

		//depois que inserimos todos os elementos no documentFragment, inserimos ele na listEl.
		listEl.appendChild(docFragment);
	};

	//abrir o formulario para criar um novo contato.
	var addContact = function () {
		contactCollection.unshift(newContact());
		var item = _loadContactTemplate(0, formEl);
		item.addEventListener('click', _onclickCallback);
		listEl.insertBefore(item, listEl.firstChild);
	};

	//reover contato no indice i
	var removeContact = function (i) {
		contactCollection.splice(i, 1);
		listContacts();
	};

	//atualizar contato no indice i
	var updateContact = function (i, updatedContact) {
		contactCollection[i] = updatedContact;

		var item = _loadContactTemplate(i, listItemEl);
		var currentItem = listEl.childNodes[i];

		item.addEventListener('click', _onclickCallback);
		listEl.replaceChild(item, currentItem);
	};

	//editar contato no indice i
	var editContact = function (i) {
		var item = _loadContactTemplate(i, formEl);
		var currentItem = listEl.childNodes[i];

		item.addEventListener('click', _onclickCallback);
		listEl.replaceChild(item, currentItem);
	};

	//retornar objeto contato vazio.
	var newContact = function () {
		return {name:'', phone: '', email: ''};
	};

	//adicionar eventos de criar um novo contato ao elemento selector.
	var addContactButton = function (selector) {
		var addButton = document.querySelector(selector);
		addButton.addEventListener('click', function () {
			return addContact();
		});
	};

	//gerar item da listagem de contatos, do tipo item de listagem ou formulario.
	var _loadContactTemplate = function (i, template) {
		var contact = contactCollection[i];
		var scope = {'contact':contact};
		var item = TemplateRender.render(template, scope);
		return item;
	};

	//achar o element 'A' mais próximo ao element clicado.
	var _findButton = function (e, target) {
		while(target.nodeName !== 'A' && target !== e.currentTarget) {
			target = target.parentNode;
		}
		return target.nodeName === 'A'? target :false;
	};

	//retornar o index do element dentro de uma lista de elementos.
	var _findNodeIndex = function (el, children) {
		return Array.prototype.indexOf.call(children, el);
	};

	//limpar a lista de contatos.
	var _cleanList = function () {
		while(listEl.firstChild) {
			listEl.removeChild(listEl.firstChild);
		}
	};

	//lista de callbacks dos eventos de click.
	var _callbackList = {
		edit: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			editContact(index);
		},
		remove: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			removeContact(index);
		},
		canceledit: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			var item = _loadContactTemplate(index, listItemEl);
			var currentItem = listEl.childNodes[index];

			item.addEventListener('click', _onclickCallback);
			listEl.replaceChild(item, currentItem);
		},
		update: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			var listModels = listItem.querySelectorAll('input[data-model]');
			var scope = {};
			listModels.forEach(function (item, i) {
				if(item.dataset && item.dataset.hasOwnProperty('model')) {
					scope[item.dataset.model] = item.value;
				}
			});

			updateContact(index, scope);
		}
	};

	//callback do evento de click.
	var _onclickCallback = function (e) {
		var target = e.target;
		var button = _findButton(e, target);
		if(button) {
			e.preventDefault();
		}

		//procura um callback compatível com o dataset do button.
		_callbackList.forEach(function (callback, i) {
			if(button.dataset && button.dataset.hasOwnProperty(i)) {
				//caso existir um callback, ele chama o callback passando o element LI.
				callback(e.currentTarget);
			}
		});
	};

	//métodos publicos retornados.
	return {
		init: init,
		loadContacts: loadContacts,
		addContactButton: addContactButton,
		add: addContact,
		edit: editContact,
		remove: removeContact
	};

}());