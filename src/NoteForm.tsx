import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
    onSubmit: (data: NoteData) => void,
    onAddTag: (tag: Tag) => void,
    availableTags: Tag[]
} & Partial<NoteData>
// Partial = that we can pass data but not all is required, all are optional

export function NoteForm({ 
        onSubmit, 
        onAddTag, 
        availableTags,
        title = "",
        markdown = "",
        tags = [],
     }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })
        // navigate back to the previous page that the user was on
        navigate('..')
    }

    return (
        <Form onSubmit={handleSubmit}>
            {/* use gap to create space between elements */}
            <Stack gap={4}>
               <Row>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} required defaultValue={title} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        {/* npm i react-select to use CreatableReactSelect */}
                        <CreatableReactSelect 
                        onCreateOption={label => {
                            const newTag = { id: uuidV4(), label }
                            onAddTag(newTag)
                            setSelectedTags(prev => [...prev, newTag])
                        }}
                        options={availableTags.map(tag => {
                            return {label: tag.label, value: tag.id}
                        })}
                        value={selectedTags.map(tag => {
                            return {label: tag.label, value: tag.id}
                        })}
                        // map through the selected tags an catch there values to save
                        onChange={tags => {
                            setSelectedTags(tags.map(tag => {
                                return { label: tag.label, id: tag.value}
                            })
                        )}}
                        isMulti />
                    </Form.Group>
                </Col>
               </Row>
                <Form.Group controlId="markdown">
                        <Form.Label>Body</Form.Label>
                        <Form.Control required as="textarea" rows={15} ref={markdownRef}  defaultValue={markdown}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                    {/* use Link to route back to previous page when cancel button is clicked */}
                    <Link to="..">
                        <Button type="button" variant="outline-secondary">
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>    
        </Form>
    )
}