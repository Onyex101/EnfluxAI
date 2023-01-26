/* eslint-disable camelcase */
import React from 'react';

const Iframe = ({ content }) => {
    const writeHTML = (frame) => {
        let iframe_ref = null;
        if (!frame) {
            return;
        }
        iframe_ref = frame;
        const doc = frame.contentDocument;
        doc.open();
        doc.write(content);
        doc.close();
        frame.style.width = '100%';
        frame.style.height = `${frame.contentWindow.document.body.scrollHeight}px`;
    };
    return (
        <iframe title="mainframe" src="" scrolling="yes" frameBorder="0" ref={writeHTML} />
    );
};

export default Iframe;
