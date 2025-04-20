import { Modal } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MinimalTiptapEditor } from '../rich-text-editor'

export default function ModalFormExample() {
    return (
        <Modal>
            <Button variant='outline'>Modal</Button>
            <Modal.Content className='max-w-fit'>
                <Modal.Header>
                    <Modal.Title>Create a new post</Modal.Title>
                    <Modal.Description>Fill in the form below to create a new post.</Modal.Description>
                </Modal.Header>
                <Modal.Body>
                    <MinimalTiptapEditor
                        throttleDelay={0}
                        className={cn('h-full min-h-56 w-full rounded-xl')}
                        editorContentClassName='overflow-auto h-full flex grow'
                        output='html'
                        placeholder='Type your description here...'
                        editable={true}
                        editorClassName='focus:outline-none px-5 py-4 h-full grow'
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button type='button' className='w-full'>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
