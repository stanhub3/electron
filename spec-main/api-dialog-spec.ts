import { expect } from 'chai';
import { dialog, BrowserWindow } from 'electron/main';
import { closeAllWindows } from './window-helpers';
import { ifit } from './spec-helpers';

describe('dialog module', () => {
  describe('showOpenDialog', () => {
    afterEach(closeAllWindows);
    ifit(process.platform !== 'win32')('should not throw for valid cases', () => {
      expect(() => {
        dialog.showOpenDialog({ title: 'i am title' });
      }).to.not.throw();

      expect(() => {
        const w = new BrowserWindow();
        dialog.showOpenDialog(w, { title: 'i am title' });
      }).to.not.throw();
    });

    it('throws errors when the options are invalid', () => {
      expect(() => {
        dialog.showOpenDialog({ properties: false as any });
      }).to.throw(/Properties must be an array/);

      expect(() => {
        dialog.showOpenDialog({ title: 300 as any });
      }).to.throw(/Title must be a string/);

      expect(() => {
        dialog.showOpenDialog({ buttonLabel: [] as any });
      }).to.throw(/Button label must be a string/);

      expect(() => {
        dialog.showOpenDialog({ defaultPath: {} as any });
      }).to.throw(/Default path must be a string/);

      expect(() => {
        dialog.showOpenDialog({ message: {} as any });
      }).to.throw(/Message must be a string/);
    });
  });

  describe('showSaveDialog', () => {
    afterEach(closeAllWindows);
    ifit(process.platform !== 'win32')('should not throw for valid cases', () => {
      expect(() => {
        dialog.showSaveDialog({ title: 'i am title' });
      }).to.not.throw();

      expect(() => {
        const w = new BrowserWindow();
        dialog.showSaveDialog(w, { title: 'i am title' });
      }).to.not.throw();
    });

    it('throws errors when the options are invalid', () => {
      expect(() => {
        dialog.showSaveDialog({ title: 300 as any });
      }).to.throw(/Title must be a string/);

      expect(() => {
        dialog.showSaveDialog({ buttonLabel: [] as any });
      }).to.throw(/Button label must be a string/);

      expect(() => {
        dialog.showSaveDialog({ defaultPath: {} as any });
      }).to.throw(/Default path must be a string/);

      expect(() => {
        dialog.showSaveDialog({ message: {} as any });
      }).to.throw(/Message must be a string/);

      expect(() => {
        dialog.showSaveDialog({ nameFieldLabel: {} as any });
      }).to.throw(/Name field label must be a string/);
    });
  });

  describe('showMessageBox', () => {
    afterEach(closeAllWindows);

    // parentless message boxes are synchronous on macOS
    // dangling message boxes on windows cause a DCHECK: https://cs.chromium.org/chromium/src/base/win/message_window.cc?l=68&rcl=7faa4bf236a866d007dc5672c9ce42660e67a6a6
    ifit(process.platform !== 'darwin' && process.platform !== 'win32')('should not throw for a parentless message box', () => {
      expect(() => {
        dialog.showMessageBox({ message: 'i am message' });
      }).to.not.throw();
    });

    ifit(process.platform !== 'win32')('should not throw for valid cases', () => {
      expect(() => {
        const w = new BrowserWindow();
        dialog.showMessageBox(w, { message: 'i am message' });
      }).to.not.throw();
    });

    it('throws errors when the options are invalid', () => {
      expect(() => {
        dialog.showMessageBox(undefined as any, { type: 'not-a-valid-type', message: '' });
      }).to.throw(/Invalid message box type/);

      expect(() => {
        dialog.showMessageBox(null as any, { buttons: false as any, message: '' });
      }).to.throw(/Buttons must be an array/);

      expect(() => {
        dialog.showMessageBox({ title: 300 as any, message: '' });
      }).to.throw(/Title must be a string/);

      expect(() => {
        dialog.showMessageBox({ id: 300 as any, message: '' });
      }).to.throw(/ID must be a string/);

      expect(() => {
        dialog.showMessageBox({ message: [] as any });
      }).to.throw(/Message must be a string/);

      expect(() => {
        dialog.showMessageBox({ detail: 3.14 as any, message: '' });
      }).to.throw(/Detail must be a string/);

      expect(() => {
        dialog.showMessageBox({ checkboxLabel: false as any, message: '' });
      }).to.throw(/checkboxLabel must be a string/);
    });

    it('throws errors when the ID is used', () => {
      const w = new BrowserWindow();
      dialog.showMessageBox(w, { id: 'dialog', message: 'i am message' });
      expect(
        dialog.showMessageBox(w, { id: 'dialog', message: 'i am message' })
      ).to.be.rejectedWith(/Duplicate ID found/);
    });
  });

  describe('closeMessageBox', () => {
    afterEach(closeAllWindows);

    it('closes message box', async () => {
      const w = new BrowserWindow();
      const p = dialog.showMessageBox(w, { id: 'dialog2', message: 'i am message' });
      dialog.closeMessageBox('dialog2');
      const result = await p;
      expect(result.response).to.equal(-1);
    });

    it('throws when ID is not found', () => {
      expect(() => {
        dialog.closeMessageBox('not-exist');
      }).to.throw(/ID not found/);
    });
  });

  describe('showErrorBox', () => {
    it('throws errors when the options are invalid', () => {
      expect(() => {
        (dialog.showErrorBox as any)();
      }).to.throw(/Insufficient number of arguments/);

      expect(() => {
        dialog.showErrorBox(3 as any, 'four');
      }).to.throw(/Error processing argument at index 0/);

      expect(() => {
        dialog.showErrorBox('three', 4 as any);
      }).to.throw(/Error processing argument at index 1/);
    });
  });

  describe('showCertificateTrustDialog', () => {
    it('throws errors when the options are invalid', () => {
      expect(() => {
        (dialog.showCertificateTrustDialog as any)();
      }).to.throw(/options must be an object/);

      expect(() => {
        dialog.showCertificateTrustDialog({} as any);
      }).to.throw(/certificate must be an object/);

      expect(() => {
        dialog.showCertificateTrustDialog({ certificate: {} as any, message: false as any });
      }).to.throw(/message must be a string/);
    });
  });
});
