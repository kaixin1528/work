/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useMemo } from "react";

const OTPInput = ({
  otpCode,
  setOTPCode,
  codeLength,
  inputRef,
}: {
  otpCode: string;
  setOTPCode: (otpCode: string) => void;
  codeLength: number;
  inputRef: MutableRefObject<HTMLInputElement[]>;
}) => {
  const RE_DIGIT = new RegExp(/^\d+$/);

  const valueItems = useMemo(() => {
    const valueArray = otpCode.split("");
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) items.push(char);
      else items.push("");
    }

    return items;
  }, [otpCode, codeLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    let targetValue = e.target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    const nextInputEl = e.target.nextElementSibling as HTMLInputElement | null;

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        otpCode.substring(0, idx) + targetValue + otpCode.substring(idx + 1);

      setOTPCode(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(e.target);
    } else if (targetValueLength === codeLength) {
      setOTPCode(targetValue);

      e.target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    if (e.code === "ArrowRight" || e.code === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (e.code !== "Backspace" || targetValue !== "") {
      return;
    }

    focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    // keep focusing back until previous input
    // element has value
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };

  useEffect(() => {
    if (inputRef?.current) inputRef?.current[0]?.focus();
  }, []);

  return (
    <article className="flex items-center justify-items-center gap-3 mx-auto">
      {valueItems.map((digit, index) => {
        return (
          <input
            ref={(el) => {
              if (inputRef?.current && el) inputRef.current[index] = el;
            }}
            key={index}
            type="input"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={codeLength}
            value={digit}
            onChange={(e) => inputOnChange(e, index)}
            onKeyDown={inputOnKeyDown}
            onFocus={inputOnFocus}
            className="w-16 h-24 text-center text-xl focus:outline-none placeholder:text-sm dark:placeholder:text-checkbox dark:bg-signin/10 border dark:border-signin dark:focus:ring-0 dark:focus:border-signin rounded-md"
          />
        );
      })}
    </article>
  );
};

export default OTPInput;
