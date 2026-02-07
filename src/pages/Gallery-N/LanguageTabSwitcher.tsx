import enFlag from '@/assets/flags/en.png'

export function LanguageTabSwitcher() {
  return (
    <div className="flex items-center">
      <div className="flex items-center border-b-2 border-indigo-500 px-2 pb-1">
        <img src={enFlag} className="mr-1.5 h-7 w-7" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">英语</p>
      </div>
    </div>
  )
}
