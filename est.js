navigateTo("http://localhost:8080/UI/index.html");
setValue(textbox("username"),"appvance");
setValue(password("password"),"appvance");
click(button("login"));
click(button("cancelPassChange"));
/*click(link("optionLink"));
click(link("preferencesLink"));
setSelected(select("repositoryType"),"GIT");
setValue(textbox("repositoryName"),"CheckoutBr");
setValue(textbox("repositoryURL"),"https://gitlab.com/naveen8827/dummytest.git");
setValue(textbox("repositoryUsername"),"testappvance02@gmail.com");
setValue(password("repositoryPassword"),"Appvance@123");
click(link("Clone Repository")); */

click(span("fa arrow"));
click(link("IDE"));
click(link("File"));
click(link("Open"));
click(italic("pull-left fa fa-angle-down expand-collapse-icon"));

/*click(byXPath('//div[2]/div[1]/div[4]/div/div/div[2]/div[1]/span/i[1]'));*/
doubleClick(cell("SERVER"));
//doubleClick(cell("C:"));
doubleClick(cell("builds")); //build
doubleClick(cell("appvance")); //appvance
//doubleClick(cell("AIQ_Dev"));
doubleClick(cell("AIQ")); 
doubleClick(cell("test"));
doubleClick(cell("SmokeTest"));
doubleClick(cell("scenarios"));
doubleClick(cell("UITests"));
doubleClick(cell("CopyScript.ds"));

/*click(cell("REPOSITORY"));
doubleClick(cell("REPOSITORY"));
doubleClick(cell("CheckoutBr"));
doubleClick(cell("SmokeTest_Karthik"));
doubleClick(cell("CopyScript.ds"));
click(cell("CopyScript.ds")); */
click(link("File"));
click(link("Export"));
click(link("Javascript"));
click(span("Save"));
setValue(textbox("fmFileName"),"test");
click(button("Save"));
var x=isVisible(div("msg-btns ok-btn"));
if(x==true){
click(div("msg-btns ok-btn"));
}
click(italic("fa fa-times pull-right"));
click(link("File"));
click(link("Open"));
rightClick(cell("test.js"));
click(span("Delete"));
click(link("OK"));
//assertExists(paragraph("File delete success"));


