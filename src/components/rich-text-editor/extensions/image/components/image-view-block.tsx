import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { UploadReturnType } from '@/components/rich-text-editor/extensions/image'
import { ImageActions } from '@/components/rich-text-editor/extensions/image/components/image-actions'
import { ImageAlign } from '@/components/rich-text-editor/extensions/image/components/image-align'
import type { ElementDimensions } from '@/components/rich-text-editor/extensions/image/hooks/use-drag-resize'
import { useDragResize } from '@/components/rich-text-editor/extensions/image/hooks/use-drag-resize'
import { useImageActions } from '@/components/rich-text-editor/extensions/image/hooks/use-image-actions'
import { blobUrlToBase64, randomId } from '@/components/rich-text-editor/utils'
import { Toolbar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { IconCircleAlert, IconLoaderCircle, IconTrash } from 'hq-icons'
import React from 'react'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'

const MAX_HEIGHT = 600
const MIN_HEIGHT = 120
const MIN_WIDTH = 120

interface ImageState {
    src: string
    isServerUploading: boolean
    imageLoaded: boolean
    isZoomed: boolean
    error: boolean
    naturalSize: ElementDimensions
}

const normalizeUploadResponse = (res: UploadReturnType) => ({
    src: typeof res === 'string' ? res : res.src,
    id: typeof res === 'string' ? randomId() : res.id,
})

export const ImageViewBlock = ({ editor, node, selected, updateAttributes }: NodeViewProps) => {
    const { src: initialSrc, width: initialWidth, height: initialHeight, fileName } = node.attrs
    const uploadAttemptedRef = React.useRef(false)
    const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left')

    const handleAlign = (newAlign: 'left' | 'center' | 'right') => {
        setAlign(newAlign)
        updateAttributes({ align: newAlign })
    }

    const initSrc = React.useMemo(() => {
        if (typeof initialSrc === 'string') {
            return initialSrc
        }
        return initialSrc.src
    }, [initialSrc])

    const [imageState, setImageState] = React.useState<ImageState>({
        src: initSrc,
        isServerUploading: false,
        imageLoaded: false,
        isZoomed: false,
        error: false,
        naturalSize: { width: initialWidth, height: initialHeight },
    })

    const containerRef = React.useRef<HTMLDivElement>(null)
    const [_resizing, setResizing] = React.useState<boolean>(false)

    const onDimensionsChange = React.useCallback(
        ({ width, height }: ElementDimensions) => {
            updateAttributes({ width, height })
        },
        [updateAttributes],
    )

    const aspectRatio = imageState.naturalSize.width / imageState.naturalSize.height
    const maxWidth = MAX_HEIGHT * aspectRatio
    const containerMaxWidth = containerRef.current
        ? Number.parseFloat(getComputedStyle(containerRef.current).getPropertyValue('--editor-width'))
        : Number.POSITIVE_INFINITY

    const { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg } = useImageActions({
        editor,
        node,
        src: imageState.src,
        onViewClick: (isZoomed) => setImageState((prev) => ({ ...prev, isZoomed })),
    })

    const { currentWidth, currentHeight, updateDimensions, initiateResize, isResizing } = useDragResize({
        initialWidth: initialWidth ?? imageState.naturalSize.width,
        initialHeight: initialHeight ?? imageState.naturalSize.height,
        contentWidth: imageState.naturalSize.width,
        contentHeight: imageState.naturalSize.height,
        gridInterval: 0.1,
        onDimensionsChange,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        maxWidth: containerMaxWidth > 0 ? containerMaxWidth : maxWidth,
    })

    const shouldMerge = React.useMemo(() => currentWidth <= 180, [currentWidth])

    const handleImageLoad = React.useCallback(
        (ev: React.SyntheticEvent<HTMLImageElement>) => {
            const img = ev.target as HTMLImageElement
            const newNaturalSize = {
                width: img.naturalWidth,
                height: img.naturalHeight,
            }
            setImageState((prev) => ({
                ...prev,
                naturalSize: newNaturalSize,
                imageLoaded: true,
            }))
            updateAttributes({
                width: img.width || newNaturalSize.width,
                height: img.height || newNaturalSize.height,
                alt: img.alt,
                title: img.title,
            })

            if (!initialWidth) {
                updateDimensions((state) => ({ ...state, width: newNaturalSize.width }))
            }
        },
        [initialWidth, updateAttributes, updateDimensions],
    )

    const handleImageError = React.useCallback(() => {
        setImageState((prev) => ({ ...prev, error: true, imageLoaded: true }))
    }, [])

    const handleResizeStart = React.useCallback(
        () => (event: React.PointerEvent<SVGSVGElement>) => {
            setResizing(true)
            initiateResize()(event)
        },
        [initiateResize],
    )

    const handleResizeEnd = React.useCallback(() => {
        setResizing(false)
    }, [])

    React.useEffect(() => {
        if (!isResizing) {
            handleResizeEnd()
        }
    }, [isResizing, handleResizeEnd])

    React.useEffect(() => {
        const handleImage = async () => {
            if (!initSrc.startsWith('blob:') || uploadAttemptedRef.current) {
                return
            }

            uploadAttemptedRef.current = true
            const imageExtension = editor.options.extensions.find((ext) => ext.name === 'image')
            const { uploadFn } = imageExtension?.options ?? {}

            if (!uploadFn) {
                try {
                    const base64 = await blobUrlToBase64(initSrc)
                    setImageState((prev) => ({ ...prev, src: base64 }))
                    updateAttributes({ src: base64 })
                } catch {
                    setImageState((prev) => ({ ...prev, error: true }))
                }
                return
            }

            try {
                setImageState((prev) => ({ ...prev, isServerUploading: true }))
                const response = await fetch(initSrc)
                const blob = await response.blob()
                const file = new File([blob], fileName, { type: blob.type })

                const url = await uploadFn(file, editor)
                const normalizedData = normalizeUploadResponse(url)

                setImageState((prev) => ({
                    ...prev,
                    ...normalizedData,
                    isServerUploading: false,
                }))

                updateAttributes(normalizedData)
            } catch (_error) {
                setImageState((prev) => ({
                    ...prev,
                    error: true,
                    isServerUploading: false,
                }))
            }
        }

        handleImage()
    }, [editor, fileName, initSrc, updateAttributes])

    return (
        <NodeViewWrapper ref={containerRef} data-drag-handle className='relative leading-none'>
            <div
                className='group/node-image relative rounded-lg object-contain'
                style={{
                    maxWidth: `min(${maxWidth}px, 100%)`,
                    width: currentWidth,
                    maxHeight: MAX_HEIGHT,
                    aspectRatio: `${imageState.naturalSize.width} / ${imageState.naturalSize.height}`,
                    placeSelf: align === 'center' ? 'center' : align === 'right' ? 'end' : 'start',
                }}
            >
                <div
                    className={cn(
                        'relative flex h-full outline-hidden cursor-default flex-col items-center gap-2 rounded',
                        {
                            'ring-2 ring-ring': selected || isResizing,
                        },
                    )}
                >
                    <div className='h-full'>
                        <div className='relative h-full'>
                            {imageState.isServerUploading && !imageState.error && (
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <IconLoaderCircle className='size-8 animate-spin' />
                                </div>
                            )}

                            {imageState.error && (
                                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                                    <IconCircleAlert className='size-8 text-danger' />
                                    <p className='mt-2 text-sm text-muted-foreground'>Failed to load image</p>
                                </div>
                            )}

                            <ControlledZoom
                                isZoomed={imageState.isZoomed}
                                onZoomChange={() => setImageState((prev) => ({ ...prev, isZoomed: false }))}
                            >
                                <img
                                    className={cn('h-auto rounded object-contain transition-shadow', {
                                        'opacity-0': !imageState.imageLoaded || imageState.error,
                                    })}
                                    style={{
                                        maxWidth: `min(100%, ${maxWidth}px)`,
                                        minWidth: `${MIN_WIDTH}px`,
                                        maxHeight: MAX_HEIGHT,
                                    }}
                                    width={currentWidth}
                                    height={currentHeight}
                                    src={imageState.src}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    alt={node.attrs.alt || ''}
                                    title={node.attrs.title || ''}
                                    id={node.attrs.id}
                                />
                            </ControlledZoom>
                        </div>

                        {imageState.isServerUploading && (
                            <div className='absolute inset-0 rounded bg-muted opacity-100 z-10 animate-pulse transition-opacity' />
                        )}

                        {editor.isEditable &&
                            imageState.imageLoaded &&
                            !imageState.error &&
                            !imageState.isServerUploading && (
                                <svg
                                    onPointerDown={handleResizeStart()}
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 16 16'
                                    className={cn('absolute bottom-0 right-0 size-8 transition', {
                                        'opacity-100 cursor-se-resize text-bg': selected,
                                        'text-primary cursor-nwse-resize': isResizing,
                                        'opacity-0': !isResizing && !selected,
                                    })}
                                >
                                    <title>Resize</title>
                                    <path
                                        fill='currentColor'
                                        d='M6.7 16L16 6.7V5.3L5.3 16zm3 0L16 9.7V8.3L8.3 16zm3 0l3.3-3.3v-1.4L11.3 16zm3 0l.3-.3v-1.4L14.3 16z'
                                    />
                                </svg>
                            )}
                    </div>

                    {imageState.error && (
                        <ToolbarButton tooltip='Remove image' onClick={onRemoveImg}>
                            <IconTrash />
                        </ToolbarButton>
                    )}

                    {!isResizing && !imageState.error && !imageState.isServerUploading && (
                        <Toolbar className='absolute right-3 top-3 flex flex-col'>
                            <Toolbar.Group className='bg-bg opacity-0 transition group-hover/node-image:opacity-100 group-focus-within/node-image:opacity-100'>
                                <ImageActions
                                    shouldMerge={shouldMerge}
                                    isLink={isLink}
                                    onView={onView}
                                    onDownload={onDownload}
                                    onCopy={onCopy}
                                    onCopyLink={onCopyLink}
                                />
                            </Toolbar.Group>
                            <Toolbar.Group className='bg-bg opacity-0 transition group-hover/node-image:opacity-100 group-focus-within/node-image:opacity-100'>
                                <ImageAlign
                                    onLeft={() => handleAlign('left')}
                                    onCenter={() => handleAlign('center')}
                                    onRight={() => handleAlign('right')}
                                    currentAlign={align}
                                />
                            </Toolbar.Group>
                        </Toolbar>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    )
}
