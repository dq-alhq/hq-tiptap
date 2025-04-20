import AppNavbar from '@/components/app-navbar.tsx'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Container } from '@/components/ui'
import content from './data/content.json'

export default function App() {
    return (
        <AppNavbar>
            <Container className='@xl:py-12 py-6'>
                <RichTextEditor
                    value={content}
                    className={'w-full'}
                    throttleDelay={0}
                    output='html'
                    placeholder='Type your description here...'
                    autofocus={true}
                    immediatelyRender={true}
                    editable={true}
                    injectCSS={true}
                />
            </Container>
        </AppNavbar>
    )
}
