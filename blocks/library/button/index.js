/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import ButtonControls from './button-controls';
import ButtonRender from './button-render';
import { registerBlockType, source } from '../../api';
import BlockControls from '../../block-controls';
import ToggleControl from '../../inspector-controls/toggle-control';
import BlockAlignmentToolbar from '../../block-alignment-toolbar';
import InspectorControls from '../../inspector-controls';
import BlockDescription from '../../block-description';

const { attr, children } = source;

registerBlockType( 'core/button', {
	title: __( 'Button' ),

	icon: 'button',

	category: 'layout',

	attributes: {
		url: {
			type: 'string',
			source: attr( 'a', 'href' ),
		},
		title: {
			type: 'string',
			source: attr( 'a', 'title' ),
		},
		text: {
			type: 'array',
			source: children( 'a' ),
		},
		align: {
			type: 'string',
			default: 'none',
		},
		color: {
			type: 'string',
		},
		textColor: {
			type: 'string',
		},
	},

	getEditWrapperProps( attributes ) {
		const { align, clear } = attributes;
		const props = {};

		if ( 'left' === align || 'right' === align || 'center' === align ) {
			props[ 'data-align' ] = align;
		}

		if ( clear ) {
			props[ 'data-clear' ] = 'true';
		}

		return props;
	},

	edit( { attributes, setAttributes, focus, setFocus, className } ) {
		const { text, url, title, align, color, textColor, clear } = attributes;
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const toggleClear = () => setAttributes( { clear: ! clear } );

		return [
			focus && (
				<InspectorControls key="inspector">
					<BlockDescription>
						<p>{ __( 'A nice little button. Call something out with it.' ) }</p>
					</BlockDescription>
					<ToggleControl
						label={ __( 'Stand on a line' ) }
						checked={ !! clear }
						onChange={ toggleClear }
					/>
				</InspectorControls>
			),
			focus && (
				<BlockControls key="controls">
					<BlockAlignmentToolbar value={ align } onChange={ updateAlignment } />
				</BlockControls>
			),
			<ButtonControls key="buttonControls"
				{ ...{ className, focus, setAttributes, url, setFocus, title } }
				buttonBackgroundColor={ color }
				buttonText={ text }
				buttonTextColor={ textColor }
				buttonUrl={ url }
				setButtonBackgroundColor={ ( value ) => setAttributes( { color: value } ) }
				setButtonText={ ( value ) => setAttributes( { text: value } ) }
				setButtonTextColor={ ( value ) => setAttributes( { textColor: value } ) }
				setButtonUrl={ ( value ) => setAttributes( { url: value } ) }
				showInspector={ focus }
			/>,
		];
	},

	save( { attributes } ) {
		const { url, text, title, align, color, textColor } = attributes;
		return (
			<ButtonRender
				{ ...{ align, title } }
				buttonBackgroundColor={ color }
				buttonText={ text }
				buttonTextColor={ textColor }
				buttonUrl={ url }
			/>
		);
	},
} );
