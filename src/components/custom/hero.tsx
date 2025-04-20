import ModalFormExample from '@/components/custom/dialog-form-example.tsx'
import { useTheme } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { IconBrandGithub } from 'hq-icons'

export function Hero() {
    const { setTheme: setMode, theme: mode } = useTheme()

    return (
        <div className='text-center'>
            <h1 className='mb-4 text-5xl font-extrabold tracking-tight'>Minimal Tiptap</h1>
            <p className='mb-6 text-xl'>A minimal Tiptap editor with a focus on simplicity and extensibility.</p>
            <div className='flex flex-col justify-center gap-x-2 space-y-4 sm:flex-row sm:space-y-0'>
                <Button
                    className='bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200'
                    onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                >
                    {mode === 'dark' ? 'Light' : 'Dark'} Mode
                </Button>
                <ModalFormExample />
                <a href='https://github.com/Aslam97/shadcn-tiptap' target='_blank' rel='noreferrer'>
                    <Button variant='outline'>
                        <IconBrandGithub />
                        GitHub
                    </Button>
                </a>
            </div>
        </div>
    )
}
