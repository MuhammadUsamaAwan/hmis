import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { InputGroupButton } from "../shadcn/components/ui/input-group";
import { Input, type InputProps } from "./input";

export function PasswordInput({ ...props }: InputProps) {
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preventBlur = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const toggleShow = useCallback(() => {
    const input = inputRef.current;
    const start = input?.selectionStart;
    const end = input?.selectionEnd;

    setShow(prev => !prev);

    requestAnimationFrame(() => {
      if (input && start !== null && start !== undefined) {
        input.focus();
        input.setSelectionRange(start, end ?? start);
      }
    });
  }, []);

  return (
    <Input
      {...props}
      ref={inputRef}
      type={show ? "text" : "password"}
      trailingAddon={
        <InputGroupButton onMouseDown={preventBlur} onClick={toggleShow}>
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      }
    />
  );
}
