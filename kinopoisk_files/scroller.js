
var DOWN;
var ARROW;

function getBodyScrollTop()
{
    return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
}

function getElementTop(elemId) 
{
    var elem = document.getElementById(elemId);
	var t = 0;
	while (elem)
    {
        t += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return t;
}



function getElementBottom(elemId) 
{
    var elem = document.getElementById(elemId);
	var t = 0;
    if(elem)
        t += elem.offsetHeight;
	while (elem)
    {
        t += elem.offsetTop;
        elem = elem.offsetParent;
    }
    
    return t;
}

function gotoParent(parentID,thisId)
{
    if(ARROW>0) document.getElementById("down_"+ARROW).className="d_closed";
    DOWN=thisId;

    var top=getElementTop("comment"+parentID);
    document.getElementById("down_"+parentID).className="d_open";
    ARROW=parentID;
    scrollTo(top);
}

function gotoChild(thisId)
{
    var top=getElementTop("comment"+DOWN);
    document.getElementById("down_"+thisId).className="d_closed";
    scrollTo(top);
}

function scrollTo(height,callback)
{
    $("html,body").animate({ scrollTop: height-30 }, "slow",function(){
        if(typeof(callback)=='function') {
            callback();
        }
        callback = null;
    });
}
