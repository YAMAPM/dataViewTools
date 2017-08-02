import TraceTool from '../src/trace/TraceTool'
import res from '../src/data/res.js'
let tools = new TraceTool();
tools.drawTrace({
	data: res.list
});