import React from "react";
import { QRCode } from "react-qrcode-logo";
import CopyToClipboard from "src/components/General/CopyToClipboard";

const GenerateSecret = ({
  qrCodeValue,
  setupKey,
  setTwoFaNav,
}: {
  qrCodeValue: string;
  setupKey: string;
  setTwoFaNav: (twoFaNav: number) => void;
}) => {
  return (
    <section className="grid content-start gap-7 p-10 dark:bg-info">
      <h2 className="text-2xl">Set up your two-factor authentication</h2>
      <article className="grid gap-3">
        <h4 className="text-base">
          Please scan the qr code below to add to your authentication app:
        </h4>
        <article className="mx-auto">
          <QRCode value={qrCodeValue} />
        </article>
      </article>
      <article className="grid content-start gap-1">
        <h5 className="text-sm">Or enter the setup key below:</h5>
        <article className="flex items-center gap-5 px-4 py-3 text-center dark:bg-card rounded-sm">
          <p className="mx-auto">{setupKey}</p>
          <CopyToClipboard copiedValue={setupKey} />
        </article>
      </article>
      <button
        className="py-2 px-10 mx-auto text-sm gradient-button rounded-sm"
        onClick={() => setTwoFaNav(2)}
      >
        Continue
      </button>
    </section>
  );
};

export default GenerateSecret;
