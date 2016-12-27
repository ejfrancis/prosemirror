import { ProseMeteorEditor } from 'meteor/prosemeteor:prosemirror';
import { Meteor } from 'meteor/meteor';

const docActivityTimeoutCallback = ({ docId }) => {
  alert(`Document ${docId} activity timeout reached, shutting down server session`);
};
const authenticationErrorCallback = ({ userId, docId, type, elementId }) => {
  document.getElementById(elementId).innerHTML =
  `<div style="background-color: #ffa4a4;text-align:center;vertical-align:center;"> 
        Auth Error: user id "${userId}" isn\'t allowed to ${type} doc ${docId}
    </div>`;
};

Meteor.startup(function() {
  const editor1 = new ProseMeteorEditor({
    docId: 'proofOfConceptDocId1',
    onDocActivityTimeout: docActivityTimeoutCallback,
    onAuthenticationError: ({ userId, type, docId }) => {
      authenticationErrorCallback({ userId, type, docId, elementId: 'prosemeteor-poc-1' });
    },
    proseMirrorOptions: {
      place: document.getElementById('prosemeteor-poc-1'),
      menuBar: true,
      autoInput: true,
      tooltipMenu: {selectedBlockMenu: true}
    }
  });

  const editor2 = new ProseMeteorEditor({
    docId: 'proofOfConceptDocId2',
    onDocActivityTimeout: docActivityTimeoutCallback,
    onAuthenticationError: ({ userId, type, docId }) => {
      authenticationErrorCallback({ userId, type, docId, elementId: 'prosemeteor-poc-2' });
    },
    proseMirrorOptions: {
      place: document.getElementById('prosemeteor-poc-2'),
      menuBar: true,
      autoInput: true,
      tooltipMenu: {selectedBlockMenu: true}
    }
  });

  const editor3 = new ProseMeteorEditor({
    docId: 'proofOfConceptDocId3',
    onDocActivityTimeout: docActivityTimeoutCallback,
    onAuthenticationError: ({ userId, type, docId }) => {
      authenticationErrorCallback({ userId, type, docId, elementId: 'prosemeteor-poc-3' });
    },
    proseMirrorOptions: {
      place: document.getElementById('prosemeteor-poc-3'),
      menuBar: true,
      autoInput: true,
      tooltipMenu: {selectedBlockMenu: true}
    }
  });
});
