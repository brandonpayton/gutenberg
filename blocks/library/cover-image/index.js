/**
 * WordPress dependencies
 */
import { Placeholder, Toolbar, Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import '../button/editor.scss';
import '../button/style.scss';
import ButtonControls from '../button/button-controls';
import ButtonRender from '../button/button-render';
import { registerBlockType, source } from '../../api';
import Editable from '../../editable';
import MediaUploadButton from '../../media-upload-button';
import BlockControls from '../../block-controls';
import BlockAlignmentToolbar from '../../block-alignment-toolbar';
import InspectorControls from '../../inspector-controls';
import ToggleControl from '../../inspector-controls/toggle-control';
import RangeControl from '../../inspector-controls/range-control';
import BlockDescription from '../../block-description';

const { children } = source;

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

registerBlockType( 'core/cover-image', {
	title: __( 'Cover Image' ),

	icon: 'format-image',

	category: 'common',

	attributes: {
		title: {
			type: 'array',
			source: children( 'h2' ),
		},
		url: {
			type: 'string',
		},
		align: {
			type: 'string',
		},
		id: {
			type: 'number',
		},
		hasParallax: {
			type: 'boolean',
			default: false,
		},
		dimRatio: {
			type: 'number',
			default: 50,
		},
		buttonBackgroundColor: {
			type: 'string',
		},
		buttonText: {
			type: 'string',
		},
		buttonTextColor: {
			type: 'string',
		},
		buttonUrl: {
			type: 'string',
		},
		showButton: {
			type: 'boolean',
			default: false,
		},
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, focus, setFocus, className } ) {
		const { url, title, align, id, hasParallax, dimRatio, buttonBackgroundColor, buttonText, buttonTextColor, buttonUrl, showButton } = attributes;
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const onSelectImage = ( media ) => setAttributes( { url: media.url, id: media.id } );
		const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
		const toggleShowButton = () => setAttributes( { showButton: ! showButton } );
		const setDimRatio = ( ratio ) => setAttributes( { dimRatio: ratio } );
		const style = url
			? { backgroundImage: `url(${ url })` }
			: undefined;
		const classes = classnames(
			className,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
			}
		);
		const focusedEditable = focus ? focus.editable || 'title' : null;

		const controls = focus && [
			<BlockControls key="controls">
				<BlockAlignmentToolbar
					value={ align }
					onChange={ updateAlignment }
				/>

				<Toolbar>
					<MediaUploadButton
						buttonProps={ {
							className: 'components-icon-button components-toolbar__control',
							'aria-label': __( 'Edit image' ),
						} }
						onSelect={ onSelectImage }
						type="image"
						value={ id }
					>
						<Dashicon icon="edit" />
					</MediaUploadButton>
				</Toolbar>
			</BlockControls>,
			<InspectorControls key="inspector">
				<BlockDescription>
					<p>{ __( 'Cover Image is a bold image block with an optional title.' ) }</p>
				</BlockDescription>
				<h3>{ __( 'Cover Image Settings' ) }</h3>
				<ToggleControl
					label={ __( 'Fixed Background' ) }
					checked={ !! hasParallax }
					onChange={ toggleParallax }
				/>
				<RangeControl
					label={ __( 'Background Dimness' ) }
					value={ dimRatio }
					onChange={ setDimRatio }
					min={ 0 }
					max={ 100 }
					step={ 10 }
				/>
				<ToggleControl
					label={ __( 'Show Button' ) }
					checked={ !! showButton }
					onChange={ toggleShowButton }
				/>
			</InspectorControls>,
		];

		if ( ! url ) {
			const uploadButtonProps = { isLarge: true };
			return [
				controls,
				<Placeholder
					key="placeholder"
					instructions={ __( 'Drag image here or insert from media library' ) }
					icon="format-image"
					label={ __( 'Cover Image' ) }
					className={ className }>
					<MediaUploadButton
						buttonProps={ uploadButtonProps }
						onSelect={ onSelectImage }
						type="image"
					>
						{ __( 'Insert from Media Library' ) }
					</MediaUploadButton>
				</Placeholder>,
			];
		}

		return [
			controls,
			<section
				key="preview"
				data-url={ url }
				style={ style }
				className={ classes }
			>
				{ title || !! focus ? (
					<div className="title-container">
						<Editable
							tagName="h2"
							placeholder={ __( 'Write title…' ) }
							value={ title }
							focus={ focusedEditable === 'title' ? focus : null }
							onFocus={ ( props ) => setFocus( { ...props, editable: 'title' } ) }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							inlineToolbar
					/>
					</div>
				) : null }
				<br />

				{ showButton && <ButtonControls key="buttonControls"
					{ ...{ buttonBackgroundColor, buttonText, buttonTextColor, buttonUrl } }
					className="wp-block-button aligncenter"
					focus={ focusedEditable === 'button' ? focus : null }
					setButtonBackgroundColor={ ( value ) => setAttributes( { buttonBackgroundColor: value } ) }
					setButtonText={ ( value ) => setAttributes( { buttonText: value } ) }
					setButtonTextColor={ ( value ) => setAttributes( { buttonTextColor: value } ) }
					setButtonUrl={ ( value ) => setAttributes( { buttonUrl: value } ) }
					setFocus={ ( props ) => setFocus( { ...props, editable: 'button' } ) }
					showInspector={ focus }
					/>
				}
			</section>,
		];
	},

	save( { attributes, className } ) {
		const { url, title, hasParallax, dimRatio, buttonBackgroundColor, buttonText, buttonTextColor, buttonUrl, showButton } = attributes;
		const style = url
			? { backgroundImage: `url(${ url })` }
			: undefined;
		const classes = classnames(
			className,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
			}
		);

		return (
			<section className={ classes } style={ style }>
				<h2>{ title }</h2>
				{ showButton && <ButtonRender
					align="center"
					{ ...{ buttonBackgroundColor, buttonText, buttonTextColor, buttonUrl } }
				/> }
			</section>
		);
	},
} );

function dimRatioToClass( ratio ) {
	return ( ratio === 0 || ratio === 50 )
		? null
		: 'has-background-dim-' + ( 10 * Math.round( ratio / 10 ) );
}
