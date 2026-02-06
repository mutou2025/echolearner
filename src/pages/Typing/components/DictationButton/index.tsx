import Tooltip from '@/components/Tooltip'
import { Link } from 'react-router-dom'
import IconHeadphones from '~icons/tabler/headphones'

export default function DictationButton() {
  return (
    <Tooltip content="听写模式">
      <Link
        to="/dictation"
        className="flex h-7 w-7 items-center justify-center text-lg text-indigo-500 transition-colors hover:text-indigo-600"
        aria-label="听写模式"
      >
        <IconHeadphones />
      </Link>
    </Tooltip>
  )
}
