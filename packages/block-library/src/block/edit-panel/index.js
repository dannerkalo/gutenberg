/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ESCAPE } from '@wordpress/keycodes';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import usePrevious from './use-previous';

/**
 * Object containing a WordPress Element component.
 *
 * @typedef {import('@wordpress/element').WPComponent} WPComponent
 */

/**
 * ReusableBlockEditPanel props.
 *
 * @typedef WPReusableBlockEditPanelProps
 *
 * @property {boolean}  isEditDisabled Is editing the reusable block disabled.
 * @property {boolean}  isEditing      Is the reusable block being edited.
 * @property {boolean}  isSaving       Is the reusable block being saved.
 * @property {Function} onCancel       Callback to run when editing is canceled.
 * @property {Function} onChangeTitle  Callback to run when title is changed.
 * @property {Function} onEdit         Callback to run when editing begins.
 * @property {Function} onSave         Callback to run when saving.
 * @property {string}   title          Title of the reusable block.
 */

/**
 * Panel for enabling the editing and saving of a reusable block.
 *
 * @param {WPReusableBlockEditPanelProps} props Component props.
 *
 * @return {WPComponent} The panel.
 */
export default function ReusableBlockEditPanel( {
	isEditDisabled,
	isEditing,
	isSaving,
	onCancel,
	onChangeTitle,
	onEdit,
	onSave,
	title,
} ) {
	const instanceId = useInstanceId( ReusableBlockEditPanel );
	const titleField = useRef();
	const editButton = useRef();
	const wasEditing = usePrevious( isEditing );
	const wasSaving = usePrevious( isSaving );

	// Select the input text when the form opens.
	useEffect( () => {
		if ( ! wasEditing && isEditing ) {
			titleField.current.select();
		}
	}, [ isEditing ] );

	// Move focus back to the Edit button after pressing the Escape key or Save.
	useEffect( () => {
		if ( ( wasEditing || wasSaving ) && ! isEditing && ! isSaving ) {
			editButton.current.focus();
		}
	}, [ isEditing, isSaving ] );

	function handleFormSubmit( event ) {
		event.preventDefault();
		onSave();
	}

	function handleTitleChange( event ) {
		onChangeTitle( event.target.value );
	}

	function handleTitleKeyDown( event ) {
		if ( event.keyCode === ESCAPE ) {
			event.stopPropagation();
			onCancel();
		}
	}

	return (
		<>
			{ ! isEditing && ! isSaving && (
				<div className="reusable-block-edit-panel">
					<b className="reusable-block-edit-panel__info">{ title }</b>
					<Button
						ref={ editButton }
						isSecondary
						className="reusable-block-edit-panel__button"
						disabled={ isEditDisabled }
						onClick={ onEdit }
					>
						{ __( 'Edit' ) }
					</Button>
				</div>
			) }
			{ ( isEditing || isSaving ) && (
				<form
					className="reusable-block-edit-panel"
					onSubmit={ handleFormSubmit }
				>
					<label
						htmlFor={ `reusable-block-edit-panel__title-${ instanceId }` }
						className="reusable-block-edit-panel__label"
					>
						{ __( 'Name:' ) }
					</label>
					<input
						ref={ titleField }
						type="text"
						disabled={ isSaving }
						className="reusable-block-edit-panel__title"
						value={ title }
						onChange={ handleTitleChange }
						onKeyDown={ handleTitleKeyDown }
						id={ `reusable-block-edit-panel__title-${ instanceId }` }
					/>
					<Button
						type="submit"
						isSecondary
						isBusy={ isSaving }
						disabled={ ! title || isSaving }
						className="reusable-block-edit-panel__button"
					>
						{ __( 'Save' ) }
					</Button>
				</form>
			) }
		</>
	);
}
