import m from 'mithril';
import { createHoster } from 'fibridge-host';


const State = {
  files: [],
  init() {

    const proxyAddress = window.location.hostname;
    const port = window.location.port !== "" ?
      parseInt(window.location.port, 10) :
      80;

    const secure = window.location.protocol === 'https:';
    
    createHoster({ proxyAddress, port, secure }).then((hoster) => {
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
        m(FileList, { files: State.files }),
        m('h1', "Add more files"),
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
              //const url = `${window.location.protocol}//${proxyAddress}${portStr}${fullPath}`;
              const url = `${proxyAddress}${portStr}${fullPath}`;

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
        m('a', { target: '_blank', href: `${window.location.protocol}//${url}` }, url),
        m(QRCodeView, { url }),
      );
    },
  };
};

const QRCodeView = () => {
  return {
    oncreate: (vnode) => {
      const el = document.createElement('div');
      new QRCode(el, {
        text: vnode.attrs.url,
        width: 150,
        height: 150
      });
      vnode.dom.appendChild(el);
    },
    onbeforeupdate: () => {
      return false;
    },
    view: (vnode) => {
      return m('.qr-code');
    },
  };
};

const root = document.getElementById('root');
m.mount(root, Main);
