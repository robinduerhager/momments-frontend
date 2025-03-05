import { For } from 'solid-js'
import { CommentDTO } from "$/services"
import { Avatar } from '$/components'
import { FaSolidUpload } from 'solid-icons/fa'

export const Comment = (props: {
    comment: CommentDTO
}) => {
    return (
        <div>
            <div class='flex gap-2.5'>
                <Avatar image={`${props.comment.author.avatar}`}/>
                <div class="flex flex-col grow">
                    <span class='font-semibold text-zinc-200'>{props.comment.author.name}</span>
                    {/* TODO: Dateformatter bauen (nachdem man Kommentare publishen kann, sonst kann man das schlecht testen) */}
                    <span class='text-zinc-400'>{props.comment.publishedAt ? props.comment.publishedAt : 'Draft'}</span>
                </div>

                {/* Publish Button */}
                <button>
                    <FaSolidUpload size={18} />
                </button>
            </div>

                {/* <li>author: {props.comment.author.id}</li>
                <li>id: {props.comment.id}</li>
                <li>createdAt: {props.comment.createdAt}</li>
                <li>published: {props.comment.published}</li>
                <li>publishedAt: {props.comment.publishedAt}</li>
                <li>updatedAt: {props.comment.updatedAt}</li> */}
                    {/* TODO Add Spotify, Audiomessage and Composition Types */}
                <div>
                    <For each={props.comment.modules}>
                        {(module) => {
                            if (module.type === 'TEXT') {
                            return <p>{module.text.content}</p>
                            } else {
                                return <span>Unknown Module Type</span>
                            }
                        }}
                    </For>
                </div>
        </div>
    )
}