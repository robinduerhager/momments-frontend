import { For } from 'solid-js'
import { CommentDTO, CommentService } from "$/services"
import { Avatar, DateDisplay } from '$/components'
import { PublishButton } from './PublishButton'
import { setDiscussions } from '$/store'
import { spotifyEmbedder } from '$/services/embedders'

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

            {/* <li>author: {props.comment.author.id}</li>
                <li>id: {props.comment.id}</li>
                <li>createdAt: {props.comment.createdAt}</li>
                <li>published: {props.comment.published}</li>
                <li>publishedAt: {props.comment.publishedAt}</li>
                <li>updatedAt: {props.comment.updatedAt}</li> */}
            {/* TODO Add Spotify, Audiomessage and Composition Types */}
            <div class='flex flex-col gap-1'>
            {/* "https://open.spotify.com/embed/track/1CZw0Lymzi2Lvy1XZ6rXh5?utm_source=generator" */}
                <For each={props.comment.modules}>
                    {(module) => {
                        if (module.type === 'TEXT') {
                            return <p>{module.text.content}</p>
                        } else if (module.type === 'REFSONG') {
                            console.log(module)
                            return (
                                spotifyEmbedder.generate(module.refsong.content)
                            )
                        }
                        else {
                            return <span>Unknown Module Type</span>
                        }
                    }}
                </For>
            </div>
        </div>
    )
}