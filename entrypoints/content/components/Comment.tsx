import { For } from 'solid-js'
import { FaSolidTrash } from 'solid-icons/fa'
import { CommentDTO, CommentModulesService, CommentModuleType, CommentService } from "$/services"
import { Avatar, DateDisplay } from '$/components'
import { PublishButton } from './PublishButton'
import { setDiscussions } from '$/store'
import { refSongEmbedder } from '$/services/embedders'

export const Comment = (props: {
    comment: CommentDTO
}) => {

    const handlePublishComment = async () => {
        const updatedComment = await CommentService.publishComment(props.comment.id)

        if (!updatedComment)
            return console.error('Something went wrong')

        // Update the comment in the store with the new published and publishedAt values
        setDiscussions('active', 'comments', (comment) => !comment.published, produce(comment => {
            comment.published = updatedComment.published
            comment.publishedAt = updatedComment.publishedAt
        }))
    }

    const handleModuleDelete = async (id: number) => {
        const deletedModuleId = await CommentModulesService.delete(id)

        if (!deletedModuleId)
            return console.error('Something went wrong')

        // Remove the deleted Module from the modules list of that Comment
        // e.g. construct a new array without the deleted module
        setDiscussions('active', 'comments', (comment) => comment.id === props.comment.id, 'modules', (modules) => modules.filter(module => module.id !== deletedModuleId))
    }

    return (
        <div class='comment'>
            <div class='flex gap-2.5 mb-2'>
                <Avatar image={`${props.comment.author.avatar}`} />
                <div class="flex flex-col grow">
                    <span class='font-semibold text-zinc-200'>{props.comment.author.name}</span>
                    <Show when={props.comment.publishedAt} fallback={<span class='text-amber-400'>Draft</span>}>
                        <DateDisplay date={new Date(props.comment.publishedAt)} />
                    </Show>
                </div>

                <Show when={!props.comment.published}>
                    <PublishButton commentHasModules={Boolean(props.comment.modules.length)} onClick={handlePublishComment} />
                </Show>
            </div>

            {/* TODO Add Composition Type */}
            <div class='flex flex-col gap-1'>
                <For each={props.comment.modules}>
                    {(module) => {
                        if (module.type === CommentModuleType.TEXT) {
                            return (
                                <div class={`${!props.comment.publishedAt ? 'flex pr-5 items-center' : 'flex items-center'}`}>
                                    <p class='grow'>{module.text!.content}</p>
                                    <Show when={!props.comment.publishedAt}>
                                        <button onClick={() => handleModuleDelete(module.id)}>
                                            <FaSolidTrash size={16} />
                                        </button>
                                    </Show>
                                </div>
                            )
                        } else if (module.type === CommentModuleType.REFSONG) {
                            return (
                                <div class={`${!props.comment.publishedAt ? 'flex pr-5 items-center' : 'flex items-center'}`}>
                                    {refSongEmbedder.generate(module.refsong!.content)}
                                    <Show when={!props.comment.publishedAt}>
                                        <button onClick={() => handleModuleDelete(module.id)}>
                                            <FaSolidTrash size={16} />
                                        </button>
                                    </Show>
                                </div>
                            )
                        } else if (module.type === CommentModuleType.AUDIOMESSAGE) {
                            return (
                                <div class={`${!props.comment.publishedAt ? 'flex pr-5 items-center' : 'flex items-center'}`}>
                                    <audio controls { ...{controlsList: "nodownload"} } class='grow' src={`${module.audio!.audioFile.fileName}`}></audio>
                                    <Show when={!props.comment.publishedAt}>
                                        <button onClick={() => handleModuleDelete(module.id)}>
                                            <FaSolidTrash size={16} />
                                        </button>
                                    </Show>
                                </div>
                            )
                        } else {
                            return <span>Unknown Module Type</span>
                        }
                    }}
                </For>
            </div>
        </div>
    )
}