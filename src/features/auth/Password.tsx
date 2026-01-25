import { EyeClosed, EyeIcon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

interface PasswordInputProps extends React.ComponentProps<'input'> {
  label: string
  htmlFor?: string
  errorMessage?: string
}
export const PasswordInput = ({
  label,
  htmlFor,
  errorMessage,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <Field>
      <FieldLabel htmlFor={htmlFor} className="text-heading">
        {label}
      </FieldLabel>
      <FieldContent>
        <InputGroup className="bg-white">
          <InputGroupInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            id={htmlFor}
            {...props}
          />
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupAddon
            onClick={() => setShowPassword((prev) => !prev)}
            align="inline-end"
            className="cursor-pointer"
          >
            {showPassword ? <EyeIcon /> : <EyeClosed />}
          </InputGroupAddon>
        </InputGroup>
        <FieldError>{errorMessage}</FieldError>
      </FieldContent>
    </Field>
  )
}
