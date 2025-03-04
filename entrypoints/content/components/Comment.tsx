import { Match, For } from 'solid-js'
import { CommentDTO } from "$/services"

export const Comment = (props: {
    comment: CommentDTO
}) => {
    console.log(props.comment.modules)
    return (
        <div>
            <ul>
                <li>author: {props.comment.author.id}</li>
                <li>id: {props.comment.id}</li>
                <li>createdAt: {props.comment.createdAt}</li>
                <li>published: {props.comment.published}</li>
                <li>publishedAt: {props.comment.publishedAt}</li>
                <li>updatedAt: {props.comment.updatedAt}</li>
                <ul>
                    {/* TODO Add Spotify, Audiomessage and Composition Types */}
                <For each={props.comment.modules}>
                    {(module) => {
                        if (module.type === 'TEXT') {
                           return <li>module Content: {module.text.content}</li>
                        } else {
                            return <li>Unknown Module Type</li>
                        }
                    }}
                </For>
                </ul>
            </ul>
        </div>
    )
}