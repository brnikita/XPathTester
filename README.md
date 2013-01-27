XPathTester
===========
<h3>Links for tests:</h3>
<ul>
    <li>http://tester.soshace.com/forTest/test.xml</li>
</ul>
<h3><a href="http://tester.soshace.com">DEMO</a></h3>
<h3>Task:</h3>
<h4>"XPath Tester" Web page.</h4>
<p>
It should be a single web page with a set of the .js and .css resources located in the same directory or included in the page. It will be used to evaluate a set of XPath expressions against the randomly selected regular XML file.
NOTE: This task is intended to demonstrate JavaScript and DOM programming skills, so NO external JS frameworks should be used. All work should be performed in the browser, NO server side scripting is allowed.
</p>
<p>
The web page should have an input field where XML file path to load will be specified. This XML file should be loaded and XML text should be rendered on the page with the text highlighting - different colors should be used to highlight element names, attribute names, and attribute values; Text and CDATA nodes content may be left without highlighting.
XML text should be reformatted to fit the page in the best way, each new element should start on new line.
Features which good to have:
<li>
Rendered XML may support XML elements folding.
</li><li>	Rendered XML may react on mouse pointer and highlight the start tag and the end tag of the XML node which is located under the pointer.
</li>
<p>
<p>
Page should have another input field where XPath expression will be entered. XPath expression should be reevaluated each time it is updated against the loaded XML, and background color of the XPath expression input field should be changed according the following rules:
<ul>
<li>
red - If XPath expression has incorrect syntax;
 </li>
 <li>yellow - If XPath expression has correct syntax but there are no XML nodes matching this rule in the loaded XML;
</li><li>green - If there are matching nodes in the loaded XML.
</li>
</p>
<p>
Each time when there are matching nodes found, they are should be highlighted with background color in the rendered XML text. All other non matching nodes should have semi transparent opacity. Any previous styling should be cancelled once the XPath expression is changed or cleared.
</p>


