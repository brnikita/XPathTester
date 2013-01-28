(function(window, document){
    var B = {
            domReady: function(callback){
                var readyStateCheckInterval = setInterval(function() {
                    if (document.readyState === 'complete') {
                        callback();
                        clearInterval(readyStateCheckInterval);
                    }
                }, 10)
            },
            eListener: function(evnt, elem, func) {
                if (elem.addEventListener)  // W3C DOM
                    elem.addEventListener(evnt,func,false);
                else if (elem.attachEvent) { // IE DOM
                    var r = elem.attachEvent('on' + evnt, func);
                    return r;
                }
                else alert('Your browser don\'t support event listeners');
            },
            addClass: function (el, c){
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
                if (re.test(el.className)) return false;
                el.className = (el.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
                return true;
            },

            removeClass: function(el, c){
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
                if (!re.test(el.className)) return false;
                el.className = el.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
                return true;
            },
            isEmpty: function(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }
                return true;
            },
            createEl: function(tagName, attr, text){
                var el = document.createElement(tagName);
                if(attr && !B.isEmpty(attr)){
                    for(var key in attr){
                        if(key == 'class'){
                            B.addClass(el, attr[key]);
                            continue;
                        }
                        el.setAttribute(key, attr[key]);
                    }
                }
                if(text){
                    el.appendChild(document.createTextNode(text));
                }
                return el;
            }
        },
        X = {
            xmlDoc: {},
            highlightNodes: [],
            sTag :{},
            eTag: {},
            init: function(){
                X.$uploadFile = document.getElementById('xFormUpFile');
                X.$xLoadXML = document.getElementById('xLoadXML');
                X.$xFormXPathT = document.getElementById('xFormXPathT');
                X.$xmlResultWrap = document.getElementById('xmlResultWrap');
                X.$xmlResult = document.getElementById('xmlResult');
                B.eListener('click', X.$xmlResult, function(e){
                    var target = e && e.target || event.srcElement,
                        parent, children, nodeGag;
                    if(target.getAttribute('data-toggle')){
                        parent = target.parentNode;
                        children = parent.getElementsByTagName('ul')[0];
                        nodeGag = parent.getElementsByTagName('del')[0];
                        if(B.removeClass(children, 'hide')){
                            B.addClass(nodeGag, 'hide');
                            B.addClass(target, 'nToggleOpen');
                            B.removeClass(target, 'nToggleClose');
                            return;
                        }
                        B.addClass(children, 'hide');
                        B.removeClass(nodeGag, 'hide');
                        B.addClass(target, 'nToggleClose');
                        B.removeClass(target, 'nToggleOpen');
                    }
                    if(target.getAttribute('data-s-tag')){
                        var bTags = target.parentNode.getElementsByTagName('b'),
                            eTag = bTags[bTags.length - 1];
                        X.pickTags(target, eTag);
                    }
                    if(target.getAttribute('data-e-tag')){
                        var sTag = target.parentNode.getElementsByTagName('b')[0];
                        X.pickTags(sTag, target);
                    }
                });
                B.eListener('keyup', X.$xFormXPathT, X.applyXPath);
                B.eListener('click', X.$xLoadXML, function(){
                    X.inputShowError(X.$uploadFile, false);
                    var path = X.$uploadFile.value;
                    if(!path){
                        X.inputShowError(X.$uploadFile, true);
                        return;
                    }
                    X.loadXML(path, X.applyXPath);
                });
            },
            loadXML :function(xmlPath, callback)
            {
                var ajaxGet;
                try {
                    ajaxGet = new XMLHttpRequest();
                    ajaxGet.open("GET", xmlPath, true);
                    ajaxGet.setRequestHeader("Content-Type", "text/xml");
                }
                catch (err) {
                    ajaxGet = new ActiveXObject("Microsoft.XMLHTTP");
                    ajaxGet.open("GET", xmlPath, true);
                    ajaxGet.setRequestHeader("Content-Type", "text/xml");
                }
                ajaxGet.onreadystatechange = function() {
                    if (ajaxGet.readyState == 4) {
                        if(ajaxGet.status >= 200 && ajaxGet.status < 300) {
                            X.xmlDoc = ajaxGet.responseXML;
                            X.$xFormXPathT.removeAttribute('disabled');
                            B.removeClass(X.$xmlResultWrap, 'hide');
                            callback();
                            return;
                        }
                        X.inputShowError(X.$uploadFile, true);
                    }
                }
                ajaxGet.send(null);
            },
            writeToDomXML: function(xml){
                var xml = xml || X.xmlDoc.documentElement,
                    topNode = document.getElementById('topNode'),
                    xmlDOM = B.createEl('ul', {'id': 'topNode'});
                if(topNode){
                    X.$xmlResult.removeChild(topNode);
                }
                xmlDOM.appendChild(X.buildXmlDOM(xml));
                X.$xmlResult.appendChild(xmlDOM);
            },
            buildXmlDOM: function (node){
                var nodeElement;
                switch(node.nodeType){
                    case 1:{
                        nodeElement = document.createElement('li');
                        nodeElement.appendChild(B.createEl('span', {'class': 'tagElement'}, '\<'));
                        nodeElement.appendChild(B.createEl('b', {'class': 'nodeName tagElement', 'data-s-tag': 's-tag'}, node.nodeName));
                        X.addAttributes(node, nodeElement);
                        nodeElement.appendChild(B.createEl('span', {'class': 'tagElement'}, '\>'));
                        nodeElement.appendChild(B.createEl('del', {'class': 'textNode hide'}, '....'));
                        X.addChildren(node, nodeElement);
                        nodeElement.appendChild(B.createEl('span', {'class': 'tagElement'}, '\<\/'));
                        nodeElement.appendChild(B.createEl('b', {'class': 'nodeName tagElement', 'data-e-tag': 'e-tag'}, node.nodeName));
                        nodeElement.appendChild(B.createEl('span', {'class': 'tagElement'}, '\>'));
                        break;
                    }
                    case 3: {
                        if(node.nodeValue){
                            nodeElement = B.createEl('span', {'class': 'textNode tagElement'}, node.nodeValue);
                            X.addAttributes(node, nodeElement);
                        }
                        break;
                    }
                    default:{
                        if(node.nodeValue){
                            nodeElement = B.createEl('span', {'class': 'tagElement'}, node.nodeValue);
                            X.addAttributes(node, nodeElement);
                        }
                    }
                }
                if(node == X.highlightNodes[0]){
                    X.highlightNodes.shift();
                    B.addClass(nodeElement, 'nodeHighlight');
                }
                return nodeElement;
            },
            addChildren: function(node, nodeElement){
                var children = node.childNodes;
                if(children.length){
                    var listCont = B.createEl('ul'),
                        childCount = 0;
                    for(var i = 0; i < children.length; i++){
                        if(children[i].nodeType == 3){
                            nodeElement.appendChild(X.buildXmlDOM(children[i]));
                            continue;
                        }
                        childCount++;
                        listCont.appendChild(X.buildXmlDOM(children[i]));
                    }
                    if(childCount){
                        var nodeToggle = B.createEl('strong', {'class': 'nodeToggle nToggleOpen', 'data-toggle': 'toggle'});
                        nodeElement.appendChild(nodeToggle);
                        nodeElement.appendChild(listCont);
                    }
                }
            },
            addAttributes: function(node, nodeElement){
                var attrs = node.attributes;
                if(attrs){
                    var attributes = document.createDocumentFragment(),
                        attrInst;
                    for(var i = 0; i < attrs.length; i++){
                        attrInst = B.createEl('span', {'class': 'nodeAttr'});
                        attrInst.appendChild(B.createEl('em', {'class': 'attrName tagElement'}, attrs[i].nodeName));
                        attrInst.appendChild(B.createEl('em', {'class': 'tagElement'}, '="'));
                        attrInst.appendChild(B.createEl('em', {'class': 'attrValue tagElement'}, attrs[i].nodeValue));
                        attrInst.appendChild(B.createEl('em', {'class': 'tagElement'}, '"'));
                        if(attrs[i] == X.highlightNodes[0]){
                            X.highlightNodes.shift();
                            B.addClass(attrInst, 'nodeHighlight');
                        }
                        attributes.appendChild(attrInst);
                    }
                    nodeElement.appendChild(attributes);
                }
            },
            inputShowError: function(el, flag){
                if(flag){
                    B.addClass(el, 'error');
                    return;
                }
                B.removeClass(el, 'error');
            },
            applyXPath: function() {
                var expr = X.$xFormXPathT.value,
                    xml,
                    xPathRes;
                B.removeClass(X.$xmlResult, 'xPathApply');
                B.removeClass(X.$xFormXPathT, 'noMatchedNodes');
                B.removeClass(X.$xFormXPathT, 'xPathGood');
                B.removeClass(X.$xFormXPathT, 'error');
                if(!expr){
                    X.writeToDomXML();
                    return;
                }
                try{
                    if(X.xmlDoc.evaluate){
                        var evaluator = new XPathEvaluator(),
                            xml = X.xmlDoc.documentElement.cloneNode(true),
                            resolver = evaluator.createNSResolver(xml);
                        xPathRes = X.xmlDoc.evaluate(expr, xml, resolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        if(xPathRes.snapshotLength == 0){
                            X.writeToDomXML();
                            B.addClass(X.$xFormXPathT, 'noMatchedNodes');
                            return;
                        }
                        B.addClass(X.$xmlResult, 'xPathApply');
                        B.addClass(X.$xFormXPathT, 'xPathGood');
                        for(var i = 0; i < xPathRes.snapshotLength; i++){
                            X.highlightNodes[i] = xPathRes.snapshotItem(i);
                        }
                    }else{
                        X.xmlDoc.setProperty("SelectionLanguage", "XPath");
                        xml = X.xmlDoc.documentElement.cloneNode(true);
                        xPathRes = xml.selectNodes(expr);
                        if(xPathRes.length == 0){
                            X.writeToDomXML();
                            B.addClass(X.$xFormXPathT, 'noMatchedNodes');
                            return;
                        }
                        B.addClass(X.$xmlResult, 'xPathApply');
                        B.addClass(X.$xFormXPathT, 'xPathGood');
                        for(var i = 0; i < xPathRes.length; i++){
                            X.highlightNodes[i] = xPathRes[i];
                        }
                    }
                }catch(e){
                    X.writeToDomXML();
                    B.addClass(X.$xFormXPathT, 'error');
                    return;
                }
                X.writeToDomXML(xml);
            },
            pickTags: function(sTag, eTag){
                B.removeClass(X.sTag, 'pickTag');
                B.removeClass(X.eTag, 'pickTag');
                if(X.sTag != sTag){
                    X.sTag = sTag;
                    X.eTag = eTag;
                    B.addClass(sTag, 'pickTag');
                    B.addClass(eTag, 'pickTag');
                }else{
                    X.sTag = {};
                    X.eTag = {};
                }
            }
        }
    B.domReady(X.init);
    window.xForm = X;
})(window, document);