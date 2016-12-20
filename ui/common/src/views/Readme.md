## Common View Files

The files in this directory can be simple HTML views that will be shared across the
server and client layers.

The process of sharing views across server and client gets difficult because the client-side uses webpack
to transpile JSX from a variety of folders while the server side uses a very simple jsx engine to render views.
The current strategy is to render views as HTML and then share that HTML code across the server and client.
Only use this method if there is not another alternative.

### Client Side (client-react folder)

In the client component, import the file as raw text. E.g.,
`import CommonView from 'raw!../../common/src/views/commonView.html'`

Then, in the React component, you can render that raw string as an html view by using `dangerouslySetInnerHTML`. E.g.,
`return <div dangerouslySetInnerHTML={{__html: CommonView}} />;`

### Server Side (server folder)

In the server jsx file, we cannot use webpack features because the React components on the server side
are loading with a jsx engine and not webpack. Instead, we can read the content as a regular file and then
use the same strategy we used for the client side.

For example (in a jsx view on the server):
``` javascript
var CommonView = fs.readFileSync(path.resolve(__dirname, '../../../../common/src/views/commonView.html'));
return (<div dangerouslySetInnerHTML={{__html: CommonView}} />);
```

**Note:** Remember to require `path` and `fs`.