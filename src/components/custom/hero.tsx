import ModalFormExample from '@/components/custom/dialog-form-example.tsx'

export function Hero() {
    return (
        <div className='text-center'>
            <h1 className='mb-4 text-5xl font-extrabold tracking-tight'>TIPTAP with HQ-UI</h1>
            <p className='mb-6 text-xl'>A lightweight Rich Text Editor built with Tiptap and HQ-UI</p>
            <div className='flex flex-col justify-center gap-x-2 space-y-4 mb-8 sm:flex-row sm:space-y-0'>
                <ModalFormExample />
            </div>
        </div>
    )
}
