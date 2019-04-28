import m from 'mithril';
import { createHoster } from 'fibridge-host';


const State = {
  files: [],
  init() {

    const proxyAddress = window.location.hostname;
    const port = 9001;
    
    createHoster({ proxyAddress, port, secure: false }).then((hoster) => {
      State.hoster = hoster;
      m.redraw();
    });
  },
};

const Main = () => {

  return {
    oninit: State.init,
    view: () => {
      return m('main', {
          'class': 'pure-g',
        },
        m(FileAdder),
      );
    },
  };
};

const FileAdder = () => {

  const proxyAddress = window.location.hostname;

  return {
    view: (vnote) => {
      return m('.file-adder.pure-u-1',
        m('h1', "Add some files"),
        m(FileList, { files: State.files }),
        m('input', {
            type: 'file',
            onchange: (e) => {
              const file = e.target.files[0];
              if (!file) {
                return;
              }

              const path = '/' + file.name;
              State.hoster.hostFile({ path, file });
              const fullPath = State.hoster.getHostedPath(path);
              const portStr = State.hoster.getPortStr();
              const url = `${window.location.protocol}//${proxyAddress}${portStr}${fullPath}`;

              const fileEntry = {
                url,
              };

              State.files.push(fileEntry);
            },
          },
          "Add File"
        )
      );
    },
  };
};

const FileList = () => {
  return {
    view: (vnode) => {
      const files = vnode.attrs.files;

      return m('.file-list',
        files.map((file) => m(File, { data: file })),
      );
    },
  };
};

const File = () => {
  return {
    view: (vnode) => {

      const url = vnode.attrs.data.url;

      return m('.file',
        m('a', { target: '_blank', href: url }, url)
      );
    },
  };
};

const root = document.getElementById('root');
m.mount(root, Main);
