import { Modal } from '@/components/ui'
import { Button } from '@/components/ui/button'
import content from '@/data/content.json'
import { cn } from '@/lib/utils'
import { RichTextEditor } from '../rich-text-editor'

export default function ModalFormExample() {
    return (
        <Modal>
            <Button variant='outline'>OPEN MODAL</Button>
            <Modal.Content className='max-w-fit'>
                <Modal.Header>
                    <Modal.Title>Create a new post</Modal.Title>
                    <Modal.Description>Fill in the form below to create a new post.</Modal.Description>
                </Modal.Header>
                <Modal.Body>
                    <RichTextEditor
                        content={content}
                        throttleDelay={0}
                        className={cn('h-full min-h-56 w-full rounded-xl')}
                        output='html'
                        placeholder='Type your description here...'
                        editable={true}
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
