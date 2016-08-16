function _textEventHandler(el) {
	this.docElement = el;
}

_textEventHandler.prototype.attachEvents = function() {
	el = this.docElement;
	el.addEventListener('mouseup', this.doMouseUp, false);
}

_textEventHandler.prototype.detachEvents = function() {
	el = this.docElement;
	el.removeEventListener('mouseup', this.doMouseUp, false);
}

/*
 * _textEventHandler.prototype.defaultfn = function() { //console.log("detached
 * events"); }
 */

 
function __addTextSelection() {
	var el = document.getElementById("lydata");
	var _elinit = new _elementEventHandler(el);
	_elinit.detachEvents();
	var _init = new _textEventHandler(el);
	_init.attachEvents();
}

function textSelection(range, anchorNode, focusNode) {
	////console.log("textSelection---")
	this.range = range;
	this.type = 3;
	this.rCollection = [];
	this.textContent = encodeURI(range.toString());
	this.anchorNode = anchorNode;
	this.focusNode = focusNode;
	this.selectionId = getRandom();
	this.yPOS = getYPOS();

	this.getTagName = function(range) {
		var el = range.startContainer.parentNode;
		return el;
	}
	this.getTagIndex = function(el) {
		var index = $(el.tagName).index(el);
		return index;
	}

	this.simpleText = function(node, range) {
		//console.log("ignored data---------ata");		
		if (!node)
			var entry = this.createEntry(this.anchorNode, this.range);
		else
			var entry = this.createEntry(node, range);
		
		//console.log(entry);
		//console.log("ignored data---------ata");		
		
		if(entry.data == "%20%0A%20%20%20%20%20"){
			//console.log("ignored data---------ata");			
		}
		else{
			this.rCollection.push(entry);
					//console.log("entry else");
		//console.log(entry.fontColor);		
		
			this.highlight(this.rCollection[0].range);
			this.crossIndexCalc();
			textSelection._t_list.push(this);
			pushto_G_FactualEntry(this);
		}
		
	}

	this.compositeText = function() {
		this.findSelectionDirection();
		var flag = this.splitRanges(this.anchorNode, this.focusNode,
				this.range.startOffset, this.range.endOffset);
		if (flag == 0) {
			for (j in this.rCollection) {
				this.highlight(this.rCollection[j].range);
			}
		}
		this.crossIndexCalc();
		textSelection._t_list.push(this);
		pushto_G_FactualEntry(this);
	}
}

textSelection._t_list = [];

textSelection.prototype.findSelectionDirection = function() {
	var tempanchor = this.findParentNode(this.anchorNode,
			this.range.commonAncestorContainer);
	var tempfocus = this.findParentNode(this.focusNode,
			this.range.commonAncestorContainer);
	var lenAnchor = this.nodeCount(tempanchor,
			this.range.commonAncestorContainer);
	var lenFocus = this
			.nodeCount(tempfocus, this.range.commonAncestorContainer);
	if (lenAnchor > lenFocus) {
		var temp = this.anchorNode;
		this.anchorNode = this.focusNode;
		this.focusNode = temp;
	}
}

textSelection.prototype.findParentNode = function(node, commonNode) {
	var pn = node;
	var currNode = pn;
	while (pn != commonNode) {
		currNode = pn;
		pn = pn.parentNode;
	}
	return currNode;
}

textSelection.prototype.nodeCount = function(node, commonNode) {
	var length = commonNode.childNodes.length; // commonnode must be a element
												// node;
	var childrens = commonNode.childNodes;
	for (var nodeCount = 0; nodeCount < length; nodeCount++) {
		if (childrens[nodeCount] == node) {
			return nodeCount; // returning node count from commonnode
		}
	}
	return (-1); // commonnode does not contain particular node
}

textSelection.prototype.createEntry = function(node, range) {
	var el = this.getTagName(range);
	var entry = {};
	entry.range = range;
	entry.node = node;
	entry.tagName = el.tagName;
	entry.tagIndex = this.getTagIndex(el);
	entry.data = encodeURI(range.toString());
	entry.nodeType = node.nodeType;
	entry.sIdx = range.startOffset;
	entry.eIdx = range.endOffset;	
	if(lynked_bgColor == null || lynked_bgColor =="undefined"){
		entry.bgColor = "rgb(255, 255, 0)";
	}
	else{
		entry.bgColor = lynked_bgColor;
	}
	if(lynked_fontColor == null || lynked_fontColor =="undefined"){
		entry.fontColor = "rgb(0, 0, 0)";
	}
	else{
		entry.fontColor = lynked_fontColor;
	}
	return entry;
}

textSelection.prototype.highlight = function(range) {
	if (range.pasteHTML) {
		range.pasteHTML('<span id= "span1" class="hilited1">' + range.text
				+ '</span>');
	} else {
			if(lynked_bgColor == null || lynked_bgColor =="undefined"){
				lynked_bgColor = "yellow"
			}
			if(lynked_fontColor == null || lynked_fontColor =="undefined"){
				lynked_fontColor = "Black"
			}
		var newNode = $('<factual id= "span1" style= "color:'
				+ lynked_fontColor + ';background-color:' + lynked_bgColor
				+ ';" />')[0];
		range.surroundContents(newNode);
	}
}

textSelection.prototype.splitRanges = function(anchornode, focusnode,
		startOffset, endOffset) {
	var stop = 0;
	var lastParent = anchornode;
	var node = anchornode;
	while (stop == 0) {
		if (node.nodeType == 3) {
			stop = this.testEnd(node, focusnode, startOffset, endOffset);
			startOffset = 0;
		}

		if (stop == 1) {
			return 0;
		}
		if (node.nodeType == 1 && node != lastParent) {

			if (node.firstChild) {
				node = node.firstChild;
				while (node.nodeType == 1) {
					node = node.firstChild;
				}
			}

			if (node.nodeType == 3) {
				stop = this.testEnd(node, focusnode, startOffset, endOffset);
			}

		}
		if (node.nextSibling && node.nextSibling != lastParent) {
			node = node.nextSibling;
		} else if (node.parentNode.nextSibling
				&& node.parentNode.nextSibling != lastParent) {
			lastParent = node.parentNode;
			node = node.parentNode.nextSibling;
		} else {
			node = node.parentNode;
			lastParent = node;
		}
	}
	return 0;
}

textSelection.prototype.testEnd = function(anchornode, focusnode, startOffset,
		endOffset) {
	if (anchornode == focusnode) {
		var node = focusnode;
		this.addRange(node, startOffset, endOffset);
		return 1;
	} else {
		var node = anchornode;
		endOffset = node.data.length;
		this.addRange(node, startOffset, endOffset);
		return 0;
	}
}

textSelection.prototype.addRange = function(node, startOffset, endOffset) {
	var textRange = document.createRange();
	textRange.setStart(node, startOffset);
	textRange.setEnd(node, endOffset);
	var entry = this.createEntry(node, textRange);
		//console.log("entry color data");			
		//console.log(entry.fontColor);			

	// added to remove blank space in data by desing
	if(entry.data == "%20%0A%20%20%20%20%20"){
		//console.log("FN data");			
	}
	else{
		this.rCollection.push(entry);
	}
}

textSelection.prototype.crossIndexCalc = function() {
	var j = 0;
	while (j < this.rCollection.length) {
		currObj = this.rCollection[j];
		var k = 0, len = 0;
		var childrens = currObj.range.startContainer.childNodes;
		var length = currObj.range.startContainer.childNodes.length;
		while (k < length) {
			if (childrens[k].nodeType == 1 && childrens[k].id == 'span1') {
				currChild = childrens[k].childNodes;
				var kk = 0, sIdx = 0, eIdx = 0;
				while (kk < childrens[k].childNodes.length) {
					if (currChild[kk].nodeType == 3) {
						var textRange = document.createRange();
						textRange.selectNode(currChild[kk].parentNode);
						if (currChild[kk].data.trim() == decodeURI(currObj.data)
								.trim() /* currObj.data.trim() */
								&& textRange.startOffset == currObj.range.startOffset) {
							sIdx = len;
							len = len + currChild[kk].data.length;
							eIdx = len;
							currObj.sIdx = sIdx;
							currObj.eIdx = eIdx;
							break;
						} else {
							len = len + currChild[kk].data.length;
						}
					}
					kk++;
				}
				k++;
			} else if (childrens[k].nodeType == 3) {
				len = len + childrens[k].data.length;
				k++;
			} else {
				k++;
			}
		}
		j++;
	}
}


function doMouseUp() {
	////console.log("Click function ----------------");
	if (window.getSelection) { 
		var userSelection = window.getSelection();
		var _wSelection = new _windowSelection(userSelection,
				userSelection.anchorNode, userSelection.focusNode);
		var range = _wSelection.getRange();
		userSelection.removeAllRanges();
		if (!range.collapsed) {
			var _rSelction = new textSelection(range, _wSelection.anchorNode,
					_wSelection.focusNode);
			if (_wSelection.anchorNode == _wSelection.focusNode) {
				_rSelction.simpleText();
			} else {
				_rSelction.compositeText();
			}
		} else {
			//console.log("empty");
		}
	} else {
		alert("Your browser does not support user selection!");
	}
}

_textEventHandler.prototype.doMouseUp = function() {
	if (window.getSelection) { // all browsers, except IE
		// before version 9
		var userSelection = window.getSelection();
		var _wSelection = new _windowSelection(userSelection,
				userSelection.anchorNode, userSelection.focusNode);
		var range = _wSelection.getRange();
		userSelection.removeAllRanges();
		if (!range.collapsed) {
			var _rSelction = new textSelection(range, _wSelection.anchorNode,
					_wSelection.focusNode);
			if (_wSelection.anchorNode == _wSelection.focusNode) {
				_rSelction.simpleText();
			} else {
				_rSelction.compositeText();
			}
		} else {
			//console.log("empty");
		}
	} else {
		alert("Your browser does not support user selection!");
	}
}

function _windowSelection(userSelection, anchorNode, focusNode) {
	this.userSelection = userSelection;
	this.anchorNode = anchorNode;
	this.focusNode = focusNode;
	/*
	 * this.anchornode = function() { return this.anchorNode; }
	 */
}

_windowSelection.prototype.getRange = function() {
	if (this.userSelection.getRangeAt) {
		var range = this.userSelection.getRangeAt(0);
		return range;
	} else { // Safari!
		var range = document.createRange();
		range.setStart(this.anchorNode, this.userSelection.anchorOffset);
		range.setEnd(this.focusNode, this.userSelection.focusOffset);
		return range;
	}
}

textSelection.prototype.removeSelection = function(entry) {
	var i = 0;
	var currObj = null, currIndex = 0;
	while (i < textSelection._t_list.length) {
		// //console.log("selecitonId: " + entry.selectionId + " " +
		// textSelection._t_list[i].selectionId);
		if (entry.selectionId == textSelection._t_list[i].selectionId) {
			currObj = textSelection._t_list[i];
			currIndex = i;
		}
		i++;
	}
	if (currObj != null) {
		textSelection._t_list.splice(currIndex, 1);
		var j = 0;
		while (j < currObj.rCollection.length) {
			var obj = currObj.rCollection[j];
			var k = 0;

			if (obj.range.startContainer.childNodes) {
				var childrens = obj.range.startContainer.childNodes;
				var length2 = obj.range.startContainer.childNodes.length; // consider
																			// this
																			// code
																			// and
																			// length2
																			// variable
			}
			var test = 0;
			while (k < length2) {
				var currNode = childrens[k];
				if (currNode.nodeType == 1 && currNode.id == "span1"
						&& decodeURI(obj.data) == childrens[k].textContent) {

					nodeToBeReplaced = currNode;
					node = currNode.firstChild;

					var replaceNode = document
							.createTextNode(currNode.textContent);
					nodeToBeReplaced.parentNode.replaceChild(replaceNode,
							nodeToBeReplaced);
					obj.range.selectNode(replaceNode);
					test = 1;
					break;
				}
				k++;
			}
			if (test == 0)
				j++;
		}
	}
}

textSelection.prototype.insertSelection = function(entry) {
	textSelection._t_list.push(entry);
	var i = 0;
	// //console.log("insert: " + entry.anchorNode + " " +
	// entry.rCollection.length);
	var length = entry.rCollection.length;
	var temp_fcolor = lynked_fontColor;
	var temp_bcolor = lynked_bgColor;
	while (i < length) {
		// //console.log("insert: " + i + " " + entry.rCollection[i].range);
		lynked_fontColor = entry.rCollection[i].fontColor;
		lynked_bgColor = entry.rCollection[i].bgColor;
		this.highlight(entry.rCollection[i].range);
		i++;
	}
	lynked_fontColor = temp_fcolor;
	lynked_bgColor = temp_bcolor;
}

var lynked_selectedCont = [];

textSelection.prototype.retrieveSelection = function(entry) {
	var length = entry.rCollection.length;
	for (var i = 0; i < length; i++) {
		var currNode = document.getElementsByTagName(
				entry.rCollection[i].tagName).item(
				entry.rCollection[i].tagIndex);
		var currData = decodeURI(entry.rCollection[i].data);
		var fIndex = entry.rCollection[i].sIdx;
		var nodeType = entry.rCollection[i].nodeType;
		if(i == 0)
			lynked_findPos(currNode);
			//lynked_selectedCont.push($(currNode).offset().top);
		lynked_fontColor = entry.rCollection[i].fontColor;
		lynked_fontColor = lynked_fontColor.split("lynk_space").join("");
		lynked_bgColor = entry.rCollection[i].bgColor;
		lynked_bgColor = lynked_bgColor.split("lynk_space").join("");
		this.findNode(currNode, currData, fIndex, nodeType);
	}
	return this;
}

textSelection.prototype.findNode = function(node, data, fIndex, nodeType) {
	var currData = data;
	currData = currData.split("lynk_space").join(" ");
	// //console.log("currData: " + currData);
	currData = currData.split("lynk_endtag").join(">");
	// //console.log("currData: " + currData);
	var localLen = 0, flag = 0;
	var childrens = node.childNodes;
	for (var j = 0; j < node.childNodes.length; j++) {
		if (childrens[j].nodeType == 1) {
			if (childrens[j].id == 'span1' && nodeType == 3
			/* && childrens[j].firstChild.nodeType != 1 */) {
				var text = childrens[j].firstChild;
				localLen = localLen + text.length;
			}

		} else {
			var fIdx = fIndex - localLen;
			localLen = localLen + childrens[j].length;
			if (fIndex < localLen) {
				this.innerSearch(childrens[j], currData, fIdx);
				break;
			}
		}
	}
}

textSelection.prototype.innerSearch = function(node, data, fIndex) {
	var fIdx, eIdx, rText, text, midText, rNode, midNode, lNode;
	if (node.nodeType === 3) {
		text = node.textContent;
		if (text.indexOf(data) > -1) {
			fIdx = fIndex;
			eIdx = fIdx + data.length;
			rText = text.substring(fIdx);
			midText = text.substring(fIdx, eIdx);
			lNode = node.splitText(fIdx);
			rNode = lNode.splitText(data.length);
			midNode = lNode;
			// var spanNode = document.createElement('span');
			var spanNode = document.createElement('factual');
//			//console.log("f:  " + lynked_fontColor + " b: " + lynked_bgColor);
			spanNode.style.background = lynked_bgColor;
			spanNode.style.color = lynked_fontColor;
			spanNode.className = 'hilited1';
			spanNode.id = 'span1';
			var midNodeClone = midNode.cloneNode(true);
			spanNode.appendChild(midNodeClone);
			midNode.parentNode.replaceChild(spanNode, midNode);
			// //console.log("findex: " + fIdx + "\ntext: " + midNode.nodeValue +
			// "\neindex: " + eIdx);
		}
	}
}

function lynkedUndo() {
	if (_xxgTOPxx_ != -1)
		var entry = popfrom_G_FactualEntry();
	else {
		alert("nothing to undo");
		return;
	}

	if (entry.type == 3) {
		pushto_R_FactualEntry(entry);
		var _textSel = new textSelection(entry.range, entry.anchorNode,
				entry.focusNode); // object creation without parameter
									// Constructor
		_textSel.removeSelection(entry);
	} else if(entry.type == 1){
		pushto_R_FactualEntry(entry);
		var _elSel = new _elementSelection(); // object creation without
												// parameter Constructor
		_elSel.removeSelection(entry.el, 1);
	} else {
		pushto_R_FactualEntry(entry);
		var _pmSel = new lynked_pagemarkerSelection();
		_pmSel.removeselecion(entry);
	}

	if (_xxgTOPxx_ != -1)
		window.scrollTo(0, globalSelection[_xxgTOPxx_].yPOS);
	else
		window.scrollTo(0, retrieveSelection[_xxrTOPxx_].yPOS);
}

function lynkedRedo() {
	if (_xxrTOPxx_ != -1)
		var entry = popfrom_R_FactualEntry();
	else {
		alert("nothing to redo");
		return;
	}

	if (entry.type == 3) {
		pushto_G_FactualEntry(entry);
		var _textSel = new textSelection(entry.range, entry.anchorNode,
				entry.focusNode); // object creation without parameter
									// Constructor
		_textSel.insertSelection(entry);
	} else if(entry.type == 1){
		pushto_G_FactualEntry(entry);
		var _elSel = new _elementSelection();
		_elSel.loadSelection(entry);
	} else {
		pushto_G_FactualEntry(entry);
		var _pmSel = new lynked_pagemarkerSelection();
		_pmSel.loadSelection(entry);
	}

	window.scrollTo(0, globalSelection[_xxgTOPxx_].yPOS);
}

function getYPOS() {

	var ypos = $(document).scrollTop();
//	//console.log(ypos);
	return ypos;
}

function heightConfigure() {
	var leastHeight = 0;
	if(globalSelection.length != 0)
		leastHeight = globalSelection[0].yPOS;
	else
		return leastHeight;
	var i = 1;
	while (i <= _xxgTOPxx_) {
		if (leastHeight > globalSelection[i].yPOS) {
			leastHeight = globalSelection[i].yPOS;
		}
		i++;
	}
	return leastHeight;
}

function setToken(token) {
	document.getElementById("lynk_token1").value = token;
	 //console.log("set: "+ token);
}

var globalSelection = [];
var retrieveSelection = [];
var _xxgTOPxx_ = -1, _xxrTOPxx_ = -1;

function getRandom() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
	}
	return s4() + s4();
}

function fn_Timer(entry) {
	globalSelection.push(entry);
	console.log("start :"+entry);
}

function pushto_G_FactualEntry(entry) {
	_xxgTOPxx_ = _xxgTOPxx_ + 1;
	globalSelection.push(entry);
}

function pushto_R_FactualEntry(entry) {
	_xxrTOPxx_ = _xxrTOPxx_ + 1;
	retrieveSelection.push(entry);
}

function removefrom_G_FactualEntry(entry) {
	for (var i = 0; i <= _xxgTOPxx_; i++) {
		if (globalSelection[i].selectionId == entry.selectionId) {
			globalSelection.splice(i, 1);
			_xxgTOPxx_ = _xxgTOPxx_ - 1;
			break;
		}
	}
}

function removefrom_R_FactualEntry() {
	retrieveSelection.splice(_xxrTOPxx_, 1);
	_xxrTOPxx_ = _xxrTOPxx_ - 1;
}

function popfrom_G_FactualEntry() {
	var entry = globalSelection[_xxgTOPxx_];
	removefrom_G_FactualEntry(entry);
	// pushto_R_FactualEntry(entry);
	return entry;
}

function popfrom_R_FactualEntry() {
	var entry = retrieveSelection[_xxrTOPxx_];
	removefrom_R_FactualEntry(entry);
	// pushto_G_FactualEntry(entry);
	return entry;
}

function _elementEventHandler(el) {
	this.docElement = el;
}

function _elementSelection() {
	this.el;
	this.tagName;
	this.tagIndex;
	this.type;
	this.data;
	this.selectionId;
	this.yPOS;
}
_elementSelection._el_list = [];
_elementSelection.size = 0;

_elementSelection.prototype.addSelection = function(el) {
	this.el = el;
	this.tagName = el.tagName;
	this.tagIndex = $(el.tagName).index(el);
	this.type = el.ELEMENT_NODE;
	this.data = el.textContent;
	this.selectionId = getRandom();
	this.yPOS = getYPOS();

	_elementSelection._el_list.push(this);
	pushto_G_FactualEntry(this);
	_elementSelection.size = this.size + 1;
}

_elementSelection.prototype.removeSelection = function(el, offset) {
	var tagName = el.tagName;
	var tagIndex = $(el.tagName).index(el);
	var currIndex = -1;
	for (i in _elementSelection._el_list) {
		if (_elementSelection._el_list[i].tagName == tagName) {
			if (_elementSelection._el_list[i].tagIndex == tagIndex) {
				currIndex = i;
				break;
			}
		}
	}
	// //console.log("deleted Element: " + _elementSelection._el_list[currIndex])
	if (currIndex != -1) {
		// var currTop = _elementSelection._el_list[currIndex].selectionIndex;
		var elementToBeRemoved = _elementSelection._el_list[currIndex];
		_elementSelection._el_list.splice(currIndex, 1);
		_elementSelection.size = this.size - 1;
		if (offset == 0) {
			// //console.log("removeselecion: " + elementToBeRemoved);
			removefrom_G_FactualEntry(elementToBeRemoved);
		} else {
			el.classList.remove("rcorners12");
			if (el.classList.contains("rcorners11"))
				el.classList.remove("rcorners11");
			el.setAttribute("_xxFactualNotexx_", 0);
		}
	}
}

_elementSelection.prototype.displaySelection = function() {
	//console.log("selection to displayed:");
	for (var i = 0; i < _elementSelection._el_list.length; i++) {
		//console.log("el_list:");
		//console.log(_elementSelection._el_list[i]);
	}
}

_elementEventHandler.prototype.attachEvents = function() {
	el = this.docElement;
	el.addEventListener('mouseover', this.doMouseOver, false);
	el.addEventListener('mouseout', this.doMouseOut, false);
	el.addEventListener('click', this.doMouseClick, false);
}

_elementEventHandler.prototype.detachEvents = function() {
	el = this.docElement;
	el.removeEventListener('mouseover', this.doMouseOver, false);
	el.removeEventListener('mouseout', this.doMouseOut, false);
	el.removeEventListener('click', this.doMouseClick, false);
}
/*
 * _elementEventHandler.prototype.defaultfn = function() { //console.log("detached
 * events"); }
 */

_elementSelection.prototype.loadSelection = function(entry) {
	this.tagName = entry.tagName;
	this.tagIndex = entry.tagIndex;
	this.el = document.getElementsByTagName(entry.tagName).item(entry.tagIndex);
	this.data = entry.data;
	this.type = entry.type;
	this.selectionId = entry.selectionId;
	lynked_findPos(this.el);
	//lynked_selectedCont.push($(this.el).offset().top);
	this.el.classList.add("rcorners12");
	this.el.setAttribute("_xxFactualNotexx_", 1);
	_elementSelection._el_list.push(this);
	return this;
}

function __addElementSelection() {
	var el = document.getElementById("lydata");
	var _txtinit = new _textEventHandler(el);
	_txtinit.detachEvents();
	var _elinit = new _elementEventHandler(el);
	_elinit.attachEvents();
}

_elementEventHandler.prototype.doMouseOver = function(e) {
	/*
	 * if (!e) var e = window.event; var relTarg = e.relatedTarget ||
	 * e.toElement;
	 */
	// //console.log("doMouseOver: " + e + " " + relTarg);
	var elem = e.target;
	if (elem != document.getElementById("lydata")) {
		if (elem.getAttribute("_xxFactualNotexx_") == null
				|| elem.getAttribute("_xxFactualNotexx_") == 0) {
			elem.setAttribute("_xxFactualNotexx_", 0);
			if (elem.classList.contains("rcorners11"))
				elem.classList.remove("rcorners11");
			elem.classList.add("rcorners12");
		}
	}
}

_elementEventHandler.prototype.doMouseOut = function(e) {
	var elem = e.target;
	if (elem != document.getElementById("lydata")) {
		if (elem.getAttribute("_xxFactualNotexx_") == 0) {
			if (elem.classList.contains("rcorners12"))
				elem.classList.remove("rcorners12");
			elem.classList.add("rcorners11");
		}
	}
}

_elementEventHandler.prototype.doMouseClick = function(e) {
	var elem = e.target;
	if (elem != document.getElementById("lydata")) {
		if (elem.getAttribute("_xxFactualNotexx_") == 0) {
			if (elem.classList.contains("rcorners11"))
				elem.classList.remove("rcorners11");
			elem.classList.add("rcorners12");
			elem.setAttribute("_xxFactualNotexx_", 1);
			var obj = new _elementSelection();
			obj.addSelection(elem);
			obj.displaySelection();
		} else {
			elem.classList.remove("rcorners12");
			if (elem.classList.contains("rcorners11"))
				elem.classList.remove("rcorners11");
			elem.setAttribute("_xxFactualNotexx_", 0);
			var obj = new _elementSelection();
			obj.removeSelection(elem, 0);
		}
	}
}

//pageMarker

/*var lynked_topEle,lynked_btmEle;
var lynked_markClick = 0;
var lynked_dropTarget = document.getElementById('lydata');
var lynked_winWidth;
var lynked_pgTi = 0;
var lynked_pgTj = 0;
var lynked_pgStoreT = [];
var lynked_pgStoreB = [];
var lynked_markId = 1;

function _pageEventHandler(el) {
	this.docElement = el;
}

function lynked_pagemarkerSelection(){
	this.type;
	this.selectionId;
	this.lynked_pgStoreT = [];
	this.lynked_pgStoreB = [];
	this.yPOS;
}
lynked_pagemarkerSelection._pm_list =[];
lynked_pagemarkerSelection.size = 0;

function __addPageMarkerSelection() {
	var el = document.getElementById("lydata");
	var _txtinit = new _textEventHandler(el);
	_txtinit.detachEvents();
	var _elinit = new _elementEventHandler(el);
	_elinit.detachEvents();
	//console.log("getting addPageMarkerSelection");
	var _elPg = new _pageEventHandler(el);
	_elPg.lynked_pagemarker();
	_elPg.attachEvent(el);
}

_pageEventHandler.prototype.attachEvent = function(el) {
		el = this.docElement;
		//console.log("----------------")
		//console.log("----------------")
		//console.log(el)
		//console.log(this);
		var lynked_pgMarkBtn = document.getElementById('lynked-pgMark');
		el.addEventListener('dragstart', this.dragStart, false);
		el.addEventListener('dragenter', this.dragEnter, false);
		el.addEventListener('dragover', this.dragOver, false);
		el.addEventListener('dragleave', this.dragLeave, false);
		el.addEventListener('drop', this.drop, false);
		lynked_pgMarkBtn.addEventListener('click', this.lynked_pg_MarkBtn, false);
	}
	_pageEventHandler.prototype.detachEvent = function(el) {
		el = this.docElement;
		var lynked_pgMarkBtn = document.getElementById('markbtn1');
		el.removeEventListener('dragstart', this.dragStart, false);
		el.removeEventListener('dragenter', this.dragEnter, false);
		el.removeEventListener('dragover', this.dragOver, false);
		el.removeEventListener('dragleave', this.dragLeave, false);
		el.removeEventListener('drop', this.drop, false);
		lynked_pgMarkBtn.removeEventListener('click', this.lynked_pg_MarkBtn, false);
	}

	lynked_pagemarkerSelection.prototype.addSelection = function(a, b) {
		this.type = 15;
		this.selectionId = getRandom();
		this.yPOS = getYPOS();
		this.lynked_pgStoreT.push(a);
		this.lynked_pgStoreB.push(b);
		lynked_pagemarkerSelection._pm_list.push(this);
		pushto_G_FactualEntry(this);
		lynked_pagemarkerSelection.size = lynked_pagemarkerSelection.size + 1;

	}

	lynked_pagemarkerSelection.prototype.removeselecion = function(entry) {

		var i = 0;
		var currObj = null, currIndex = 0;
		while (i < lynked_pagemarkerSelection._pm_list.length) {
			// //console.log("selecitonId: " + entry.selectionId + " " +
			// textSelection._t_list[i].selectionId);
			if (entry.selectionId == lynked_pagemarkerSelection._pm_list[i].selectionId) {
				currObj = lynked_pagemarkerSelection._pm_list[i];
				currIndex = i;
			}
			i++;
		}
		if (currObj != null) {
			lynked_pagemarkerSelection._pm_list.splice(currIndex, 1);
			lynked_pagemarkerSelection.size = lynked_pagemarkerSelection.size - 1;
			$('.lynked-pgS').attr('pmid',function(){
				($('.lynked-pgS').attr('pmid') == entry.selectionId)? $(this).remove() : '';
				});
			var canvasIdT = currObj.lynked_pgStoreT[3];
			document.getElementById(canvasIdT).remove();
			var canvasIdB = currObj.lynked_pgStoreB[3];
			document.getElementById(canvasIdB).remove();
		}
	}

	lynked_pagemarkerSelection.prototype.loadSelection = function(entry) {
		//console.log("entry ----------------");
		//console.log(entry);
		var canvasIdT = entry.lynked_pgStoreT[0];
		//console.log("load data top");
		//console.log(canvasIdT);
		lynked_pgRecreate(canvasIdT);
		var canvasIdB = entry.lynked_pgStoreB[0];
		//console.log("load data btm");
		//console.log(canvasIdB);
		lynked_pgRecreate(canvasIdB);
	}


	function lynked_createCanvas(tagN, tagId, tagAttr, tagStyle) {
	    //console.log("create  cont");
	    //console.log(tagN);
	    //console.log(tagId);
	    //console.log(tagAttr);
	    //console.log(tagStyle);
	    var lynked_canvasTag = document.createElement(tagN);
	    lynked_canvasTag.id = tagId;
	    for (i = 0; i < tagAttr.length; i++) {
	      var lynked_pgCtemp = tagAttr[i];
	      lynked_canvasTag[lynked_pgCtemp[0]] = lynked_pgCtemp[1];
	    }
	    lynked_canvasTag.style.cssText = tagStyle;
	    //console.log("end")
	    //console.log("aftrcreate  cont");
	    //console.log(lynked_canvasTag);
	    return lynked_canvasTag;
	}

	//canvas Pg top
    function lynked_pgCanvasT(lynked_canvasIdT) {
      var lynked_c = document.getElementById(lynked_canvasIdT);
      //console.log("canvasfun in");
      //console.log(lynked_canvasIdT);
      //console.log(lynked_c);
      var lynked_ctx = lynked_c.getContext("2d");
			lynked_winWidth = lynked_dropTarget.offsetWidth;
      lynked_ctx.canvas.width = lynked_winWidth;
      var lynked_canvasTxtTop = "Page Marker Starts";
      lynked_ctx.font = "16px Helvetica";
      var lynked_txtTopWidth = lynked_ctx.measureText(lynked_canvasTxtTop).width;
      lynked_txtTopWidth = Math.round(lynked_txtTopWidth) + 10;
      //console.log("widthT" + lynked_txtTopWidth);
      // line
      lynked_ctx.moveTo(0, 20);
      lynked_ctx.lineTo(lynked_winWidth, 20);
      lynked_ctx.lineWidth = 1;
      lynked_ctx.strokeStyle = '#FF0000';
      lynked_ctx.stroke();
      // triangle
      lynked_ctx.moveTo(0, 0); //topleft end
      lynked_ctx.lineTo(0, 40); //bottom left end
      lynked_ctx.lineTo(20, 20); //horz length,top top btm
      lynked_ctx.fillStyle = "#FF0000";
      lynked_ctx.fill();
      // rectangle
      lynked_ctx.fillStyle = "rgba(10, 26, 52, 0.7)";
      lynked_ctx.fillRect(20, 0, lynked_txtTopWidth, 20);
      // txt
      lynked_ctx.fillStyle = '#FFF';
      lynked_ctx.fillText(lynked_canvasTxtTop, 25, 16);
    }

    // canvas pg btm
    function lynked_pgCanvasB(lynked_canvasIdB) {
      var lynked_c1 = document.getElementById(lynked_canvasIdB);
      var lynked_ctx1 = lynked_c1.getContext("2d");
			lynked_winWidth = lynked_dropTarget.offsetWidth;
      lynked_ctx1.canvas.width = lynked_winWidth;
      var lynked_canvasTxtBtm = "Page Marker Ends";
      lynked_ctx1.font = "16px Helvetica";
      var lynked_txtBtmWidth = lynked_ctx1.measureText(lynked_canvasTxtBtm).width;
      lynked_txtBtmWidth = Math.round(lynked_txtBtmWidth) + 10;
      //console.log("widthB" + lynked_txtBtmWidth);
      var lynked_winWidthBtm = lynked_winWidth - 20;
      //line
      lynked_ctx1.moveTo(0, 20);
      lynked_ctx1.lineTo(lynked_winWidth, 20);
      lynked_ctx1.lineWidth = 1;
      lynked_ctx1.strokeStyle = '#FF0000';
      lynked_ctx1.stroke();
      //triangle
      lynked_ctx1.moveTo(lynked_winWidth, 0);
      lynked_ctx1.lineTo(lynked_winWidth, 40);
      lynked_ctx1.lineTo(lynked_winWidthBtm, 20);
      lynked_ctx1.fillStyle = "#FF0000";
      lynked_ctx1.fill();
      // rectangle
      var lynked_rectSize = lynked_winWidth - lynked_txtBtmWidth - 20;
      lynked_ctx1.fillStyle = "rgba(10, 26, 52, 0.7)";
      lynked_ctx1.fillRect(lynked_rectSize, 0, lynked_txtBtmWidth, 20);
      // txt
      lynked_ctx1.fillStyle = '#FFF';
      lynked_ctx1.fillText(lynked_canvasTxtBtm, lynked_rectSize + 5, 16);
    }

    function lynked_pgHeight() {
        var lynked_docHeight = document.documentElement.scrollHeight;
        var lynked_winHeight = document.documentElement.clientHeight;
        var lynked_scrlHeight = window.pageYOffset;
        var lynked_adjMarkerHeight = 50;
        var lynked_top = (parseFloat((lynked_scrlHeight + lynked_adjMarkerHeight) / lynked_docHeight) * 100).toFixed(2);
        // var lynked_height = (parseFloat(lynked_winHeight / lynked_docHeight) * 100).toFixed(2);
        var lynked_bottom = (parseFloat((lynked_scrlHeight + lynked_winHeight - lynked_adjMarkerHeight) / lynked_docHeight) * 100).toFixed(2);
        var lynked_topEleStyle = 'position:absolute;top:' + lynked_top + '%;z-index: 2147483580';
        var lynked_BtmEleStyle = 'position:absolute;top:' + lynked_bottom + '%;z-index: 2147483580';
        lynked_topEle.style.cssText = lynked_topEleStyle;
        lynked_btmEle.style.cssText = lynked_BtmEleStyle;
      }


	_pageEventHandler.prototype.dragStart = function(event) {
				//console.log("dragStart");
        event.dataTransfer.setData("text", event.target.id);
        event.target.style.opacity = "1";
      }

      _pageEventHandler.prototype.dragEnter = function(event) {
				//console.log("dragEnter");
          if (lynked_getParents(event, "droptarget"))
					//console.log("dragEnter area");
              event.target.style.border = "3px dotted red";
          }

      _pageEventHandler.prototype.dragOver = function(event) {
				//console.log("dragOver");
        event.preventDefault();
      }

      _pageEventHandler.prototype.dragLeave = function(event) {
				//console.log("dragLeave");
          if (lynked_getParents(event, "droptarget"))
					//console.log("dragLeave area");
              event.target.style.border = "";
          }

      _pageEventHandler.prototype.drop = function(event) {
          event.preventDefault();
					//console.log("drop");
          if (lynked_getParents(event, "droptarget")) {
						//console.log("drop area");
            event.target.style.border = "";
            var data = event.dataTransfer.getData("Text");
            //console.log(data);
            document.getElementById(data).style.position = "";
						//console.log("chng width");
						//console.log(event.target.offsetWidth);
						//console.log(document.getElementById(data));
						// var lynked_pgTempC = document.getElementById(data);
						// var lynked_pgTempC1 =lynked_pgTempC.getContext("2d");
						// lynked_pgTempC1.canvas.width = event.target.offsetWidth;
            if (data == "lynked-myCanvasTop") {
              event.target.insertBefore(document.getElementById(data), event.target.firstChild);
              lynked_pgTi = 1;
            } else if (data == "lynked-myCanvasBtm") {
              event.target.appendChild(document.getElementById(data));
              lynked_pgTj = 2;
            } else {}
          }
        }

      //for if inside the area
      function lynked_getParents(event, cls) {
        //console.log(event.target.className);
        var p = event.target.parentNode;
        var isExist = false;
        while (p !== null && isExist == false) {
          //console.log(p.className);
          isExist = p.className.indexOf(cls) > -1 ? true : false;
          p = p.parentNode;
        }
        return isExist;
      }

      _pageEventHandler.prototype.lynked_pagemarker = function(){
	    //create canvas
	    var lynked_pgCanvasAtr = [];
	    var lynked_pgC_Height = ["height", "40"];
	    var lynked_pgC_draggable = ["draggable", "true"];
	    lynked_pgCanvasAtr.push(lynked_pgC_Height, lynked_pgC_draggable);
	    var lynked_pgC_style = 'display:none;z-index: 2147483580;';
	    lynked_topEle = lynked_createCanvas('canvas', 'lynked-myCanvasTop', lynked_pgCanvasAtr, lynked_pgC_style);;
	    lynked_btmEle = lynked_createCanvas('canvas', 'lynked-myCanvasBtm', lynked_pgCanvasAtr, lynked_pgC_style);;
	    //console.log("node r nt");
	    //console.log(lynked_topEle);
	    //console.log(lynked_btmEle);
	    lynked_dropTarget.insertBefore(lynked_topEle, lynked_dropTarget.firstChild);
	    lynked_dropTarget.insertBefore(lynked_btmEle, lynked_dropTarget.firstChild);
	    lynked_pgCanvasT("lynked-myCanvasTop");
	    lynked_pgCanvasB("lynked-myCanvasBtm");
	    lynked_pgHeight();
	}

	  // get data
    function lynked_pgData(lynked_eleData, lynked_eleLoc, lynked_markId) {
      var parentEle = lynked_eleData.parentElement;
      var parentTag = parentEle.tagName;
      var tagString = lynked_dropTarget.getElementsByTagName(parentTag);
      var tagString_len = tagString.length;
      for (i = 0; i < tagString_len; i++)
        if (tagString[i] === parentEle) {
          var lynked_temp = [];
          //console.log("data---------");
          //console.log("parentTag" + parentTag);
          //console.log("tg_indx" + i);
          //console.log("top/btm no" + lynked_eleLoc);
          lynked_temp.push(parentTag);
          lynked_temp.push(i);
          lynked_temp.push(lynked_eleLoc);
          lynked_temp.push(lynked_markId);
          //lynked_eleLoc == 1 ? pgNew.lynked_pgStoreT.push(lynked_temp) : pgNew.lynked_pgStoreB.push(lynked_temp);
          lynked_eleLoc == 1 ? lynked_pgStoreT.push(lynked_temp) : lynked_pgStoreB.push(lynked_temp);
        }
    }

 // create marked ele
    function lynked_pgRecreate(lynked_pgGetData) {
      var lynked_pgCanvasAtr = [];
      var lynked_pgC_Height = ["height", "40"];
      lynked_pgCanvasAtr.push(lynked_pgC_Height);
      var lynked_pgC_style = 'z-index: 2147483580;';
      var lynked_pgcanvasId = 'lynked_mark' + lynked_pgGetData[3];
      var lynked_canvasTag = lynked_createCanvas('canvas', lynked_pgcanvasId, lynked_pgCanvasAtr, lynked_pgC_style);
      //console.log("geting data");
      //console.log(lynked_pgGetData);
      //console.log(lynked_pgGetData[0]);
      //console.log(lynked_pgGetData[1]);
      //console.log(lynked_pgGetData[2]);
			//console.log(lynked_pgGetData[3]);
      var lynked_dropEle = lynked_dropTarget.getElementsByTagName(lynked_pgGetData[0]).item(lynked_pgGetData[1]);
      if (lynked_pgGetData[2] == 1) {
        //console.log("1---------");
        //console.log(lynked_dropEle);
        //console.log("---------");
        lynked_dropEle.insertBefore(lynked_canvasTag, lynked_dropEle.firstChild);
        lynked_pgCanvasT(lynked_pgcanvasId);
        //console.log("bfr inc markId" + lynked_markId);
        //console.log("afr inc markId" + lynked_markId);
      } else {
        //console.log("2---------");
        //console.log(lynked_dropEle);
        //console.log("---------");
        //console.log(typeof lynked_dropEle + "   " + typeof lynked_canvasTag);
        lynked_dropEle.appendChild(lynked_canvasTag);
        lynked_pgCanvasB(lynked_pgcanvasId);
        //console.log("bfr inc markId" + lynked_markId);
        //console.log("afr inc markId" + lynked_markId);
      }
    }

    _pageEventHandler.prototype.lynked_pg_MarkBtn = function(){
			//console.log("mark clicked");
	      if (lynked_pgTi != 0 && lynked_pgTj != 0) {
	        lynked_pgData(lynked_topEle, lynked_pgTi, lynked_markId);
	        //console.log("stored dataT");
	        //console.log(lynked_markClick);
	        //console.log(lynked_pgStoreT[0]);
	        lynked_pgRecreate(lynked_pgStoreT[0]);
	        lynked_markId  += 1;
	        //console.log("stored dataB");
	        //console.log(lynked_markClick);
	        //console.log(lynked_pgStoreB[lynked_markClick]);
	        lynked_pgData(lynked_btmEle, lynked_pgTj, lynked_markId);
	        lynked_pgRecreate(lynked_pgStoreB[0]);
	        lynked_markId  += 1;
	        lynked_pgTi = 0;
	        lynked_pgTj = 0;
	        lynked_markClick += 1;
	        //console.log("at last mark clicked" + lynked_markClick);
	        //console.log(lynked_pgStoreT);
	        //console.log(lynked_pgStoreB);
	        lynked_topEle.remove();
	        lynked_btmEle.remove();
					var pgNew = new lynked_pagemarkerSelection(el);
	        pgNew.addSelection(lynked_pgStoreT[0], lynked_pgStoreB[0]);
	        lynked_pgStoreT.slice(0, lynked_pgStoreT.length);
	        lynked_pgStoreB.slice(0, lynked_pgStoreB.length);
	      } else {
	        alert("Page Marker is not placed");
	      }
	    }
*/
var ipAdd;

    	$.getJSON('//www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
    		var ip = JSON.stringify(data, null, 2);	
    		obj = JSON.parse(ip);
    		ipAdd = obj.geoplugin_request;
    		})

var lynked_context;

var MyApp = {}; 

function zoo(str, str1, str2, str3, str4){
    MyApp.url = str;
    MyApp.name = str1;
    MyApp.desc = str2;
    MyApp.android = str3;
	MyApp.userId = str4;
}

//var lynked_context;

function submitSelections() {
	//console.log(navigator.userAgent);
	var lynk_url, jsonBody, lynk_dummy1, lynk_dummy2, lynk_name, lynk_desc, lynk_flag;
	
	for (i=0; i<globalSelection.length; i++) {
		delete globalSelection[i].anchorNode;
		delete globalSelection[i].focusNode;
		delete globalSelection[i].range;
		for(j=0; j<globalSelection[i].rCollection.length; j++) {
			delete globalSelection[i].rCollection[j].node;
			delete globalSelection[i].rCollection[j].range;		
		}	
	}	
	
	var des = JSON.stringify(globalSelection);	
	lynk_dummy1 = 0;	
	lynk_url = MyApp.url;
	lynk_dummy2 = "lynk_dummy2";
	lynk_name = MyApp.name;
	lynk_desc = MyApp.desc;
	lynk_flag =  "public";	
	appId =   MyApp.android;
	userId = MyApp.userId;
	
	 if(ipAdd == "undefined"|| ipAdd == undefined){
		  ipAdd = "52.40.124.98";
		 }
	
	jsonBody = 'storedSelections=' + encodeURI(des) + 
				'&lynk_url='+ lynk_url + 
				'&lynk_dummy1='+ lynk_dummy1 +
				'&lynk_dummy2='+ lynk_dummy2 + 
				'&lynk_name=' + lynk_name + 
				'&lynk_desc='+ lynk_desc +
				'&appId='+appId+
				'&lynk_flag=' + lynk_flag+
				'&userId=' + userId+
				'&lynk_ip=' + ipAdd;
	$.ajax({
		async : true,
		type : "POST",
		url : "http://factualnote.com/MobileDataServlet",
		data: jsonBody,
		success : function(data) {
			alert(data);
			MyApp.token = data;
			//setToken(data)
		},
		error : function(data, status, er) {
			alert("error: " + data + " status: " + status + " er:" + er);
		}
	});	 
}


 function submitSelection() {
	var lynk_url, jsonBody, lynk_dummy1, lynk_dummy2, lynk_name, lynk_desc, lynk_flag;
	var selections = JSON.stringify(globalSelection);
//	console.log(start);
//	console.log(stop);
	var selectedTags = factualnote_tags;
	
	lynk_dummy1 = heightConfigure();
	lynk_url = document.getElementById("lynk_url").value;
	document.getElementById("lynk_dummy1").value = lynk_dummy1;
	lynk_dummy2 = document.getElementById("lynk_dummy2").value;
	lynk_name = document.getElementById("lynk_name").innerHTML;
	lynk_desc = document.getElementById("lynk_desc").innerHTML;
	lynk_flag = $('#lynk_flag:checked').val();
	

	
	
	if (document.getElementById("lynk_flag1").checked == true) {
		lynk_flag = "private";
	} else {
		lynk_flag = "public";
	}
	
	jsonBody = 'storedSelections=' + encodeURI(selections) + '&lynk_url='
			+ lynk_url + '&lynk_dummy1=' + lynk_dummy1 + '&lynk_dummy2='
			+ lynk_dummy2 + '&lynk_name=' + lynk_name + '&lynk_desc='
			+ lynk_desc + '&lynk_flag=' + lynk_flag+ '&lynk_ip=' + ipAdd+ '&selectedTags=' + selectedTags;
	//console.log(jsonBody);

	$.ajax({
		async : false,
		type : "POST",
		url : lynked_context+"/DataServlet",
		data : jsonBody,
		success : function(data) {
			setToken(data);
		},
		error : function(data, status, er) {
			alert("error: " + data + " status: " + status + " er:" + er);
		}
	});
} 

var lynked_fontColor, lynked_bgColor,lynked_lydata,lynked_textMarker_btn,lynked_elementMarker_btn,lynked_txtColor_btn,lynked_hilightColor_btn,lynked_undo_btn,lynked_redo_btn;
function lynked_markerColor() {
	lynked_fontColor = $('.lynked-textColor').css("background-color");
	lynked_bgColor = $('.lynked-highlighterColor').css("background-color");
}
function lynked_editorFn(){
	lynked_context = document.getElementById('lynk_context').value;
	lynked_lydata = document.getElementById('lydata');
	lynked_textMarker_btn = document.getElementById('Lynked-textMarker');
	lynked_elementMarker_btn = document.getElementById('Lynked-elementMarker');
	lynked_txtColor_btn = document.getElementById('lynked-txtColor');
	lynked_hilightColor_btn = document.getElementById('lynked-hilightColor');
	lynked_undo_btn = document.getElementById('lynked-undo');
	lynked_redo_btn = document.getElementById('lynked-redo');
	//console.log("sort1");
	lynked_markerColor();
	lynked_textMarker_btn.addEventListener('click',function(){
		if (lj.menuCheck()){
			lynked_lydata.style.cursor = 'text';
			__addTextSelection();
		}
	});
	lynked_elementMarker_btn.addEventListener('click',function(){
		if (lj.menuCheck()){
			lynked_lydata.style.cursor = 'default';
			__addElementSelection();
		}
	});
	
	lynked_undo_btn.addEventListener('click',function(){
		if (lj.menuCheck()){
			lynkedUndo();
		}
	});
	lynked_redo_btn.addEventListener('click',function(){
		if (lj.menuCheck()){
			lynkedRedo();
		}
	});
	
	//	keypress function
	$(document).keydown(function(e){
			if( e.which === 90 && e.ctrlKey){
				lynkedUndo();
			}
			else if( e.which === 89 && e.ctrlKey){
				lynkedRedo();
			}
			else if (e.which === 27) {
				if($('.lynked-tools li').hasClass('lynked-selected')){
					var el = document.getElementById("lydata");
					var _txtinit = new _textEventHandler(el);
					var _elinit = new _elementEventHandler(el);
					_elinit.detachEvents();
					_txtinit.detachEvents();
					$('.lynked-tools li.lynked-selected').removeClass('lynked-selected');
					$('#lydata').css('cursor', 'auto');
				}
			}
		});
}

//Height of the selected contents

function lynked_findPos(obj) {
	var curtop = 0;
	lynked_windowHeight = Math.round(window.innerHeight);
	lynked_windowCenter = lynked_windowHeight / 2;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	curtop = Math.round(curtop) - lynked_windowCenter;
	lynked_selectedCont.push(curtop);
//	//console.log("curleft,curtop----"+curtop)
	}
}
/*$(document).ready(function() {
	//console.log("loaded");
	lynkeddefColor();
	$('#lynked-undo').click(function() {
		if (lj.menuCheck())
			lynkedUndo();
	});
	$('#lynked-redo').click(function() {
		if (lj.menuCheck())
			lynkedRedo();
	});
	$('#Lynked-textMarker').click(function() {
		if (lj.menuCheck()) {
			$('#lydata').css('cursor', 'text');
			__addTextSelection();
		}
	});
	$('#Lynked-brushMarker').click(function() {
		if (lj.menuCheck()) {
			$('#lydata').css('cursor', 'text');
			__addTextSelection();
		}
	});
	$('#Lynked-elementMarker').click(function() {
		if (lj.menuCheck()) {
			$('#lydata').css('cursor', 'default');
			__addElementSelection();
		}
	});
//	$('#Lynked-pageMarker').on('click',function(){
//		if (lj.menuCheck()) {
//			$('#lydata').addClass('droptarget');
//			$('#lydata').css('cursor', 'default');
//			__addPageMarkerSelection();
//			$('.lynked-pgMark-tools').show();
//			$("#lynked-header").hasClass("lynked-url-show") ? $('.lynked-menu1').click() : '';
//		}
//	});
//
//	$('#lynked-pgMark').on('click',function(){
//
//		$('.lynked-pgMark-tools').hide();
//
//	});
//	$('#lynked-pgIgnore').on('click',function(){
//		lynked_topEle.remove();
//		lynked_btmEle.remove();
//		$('.lynked-pgMark-tools').hide();
//	});
	 color select 
	function lynkeddefColor() {
		lynked_fontColor = $('.lynked-textColor').css("background-color");
		lynked_bgColor = $('.lynked-highlighterColor').css("background-color");
	}
	$('#Lynked-colorSelector').click(function() {
		lynked_fontColor = $('.lynked-textColor').css("background-color");
		lynked_bgColor = $('.lynked-highlighterColor').css("background-color");
		lynkeddefColor();
	});
});*/

