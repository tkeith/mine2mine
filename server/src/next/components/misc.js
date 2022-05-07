const btnClasses = `
  px-6
  py-2.5
  bg-blue-600
  text-white
  font-medium
  text-xs
  leading-tight
  uppercase
  rounded
  shadow-md
  hover:bg-blue-700 hover:shadow-lg
  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
  active:bg-blue-800 active:shadow-lg
  transition
  duration-150
  ease-in-out`

export function TextButton({ children, onClick }) {
  return <button onClick={onClick} className={btnClasses}>{children}</button>
}

export function SubmitButton({ children }) {
  return <button type='submit' className={btnClasses}>{children}</button>
}

export function TextInput({ label, placeholder, helpText, defaultValue, name }) {
  return <div className="form-group mb-6">
    <label htmlFor={name} className="form-label inline-block mb-2 text-gray-700">{label}</label>
    <input type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name={name} aria-describedby="textHelp" placeholder={placeholder} defaultValue={defaultValue} />
    <small id="textHelp" className="block mt-1 text-xs text-gray-600">{helpText}</small>
  </div>
}
TextInput.defaultProps = { label: '', placeholder: '', helpText: '', defaultValue: '' }
