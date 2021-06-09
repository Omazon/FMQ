<?php
/**
 * Plugin Name: Wizard Step
 * Description: Custom plugin for create wizard Steps, Use short [wizard-step]
 * Version: 2.1
 * Author: Omar Boza
 */

define( 'MY_ACF_PATH', plugin_dir_path(__FILE__) . '/include/acf/' );
define( 'MY_ACF_URL', plugin_dir_url(__FILE__) . '/include/acf/' );
include_once( MY_ACF_PATH . 'acf.php' );
add_filter('acf/settings/url', 'my_acf_settings_url');
function my_acf_settings_url( $url ) {
    return MY_ACF_URL;
}

add_filter('acf/settings/show_admin', 'my_acf_settings_show_admin');
function my_acf_settings_show_admin( $show_admin ) {
    return false;
}

if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
		'page_title' 	=> 'Find My Quote Custom Plugin Settings',
		'menu_title'	=> 'FMQ Settings',
		'menu_slug' 	=> 'fmq-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
}
if( function_exists('acf_add_local_field_group') ):

   acf_add_local_field_group(array(
      'key' => 'group_6031de0555eb2',
      'title' => 'Availables Quotes',
      'fields' => array(
         array(
            'key' => 'field_6031de1a2f11c',
            'label' => 'My Self / My Family',
            'name' => 'my_self',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
               'width' => '',
               'class' => '',
               'id' => '',
            ),
            'message' => '',
            'default_value' => 1,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
         ),
         array(
            'key' => 'field_6031dea52f11e',
            'label' => 'My Car',
            'name' => 'my_car',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
               'width' => '',
               'class' => '',
               'id' => '',
            ),
            'message' => '',
            'default_value' => 1,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
         ),
         array(
            'key' => 'field_6031deb12f11f',
            'label' => 'My Home',
            'name' => 'my_home',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
               'width' => '',
               'class' => '',
               'id' => '',
            ),
            'message' => '',
            'default_value' => 1,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
         ),
         array(
            'key' => 'field_60749d154bd40',
            'label' => 'Contact Form ID',
            'name' => 'contact_id',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
               'width' => '50',
               'class' => '',
               'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => '',
            'max' => '',
            'step' => '',
         ),
      ),
      'location' => array(
         array(
            array(
               'param' => 'options_page',
               'operator' => '==',
               'value' => 'fmq-settings',
            ),
         ),
      ),
      'menu_order' => 0,
      'position' => 'normal',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => true,
      'description' => '',
   ));
   
   endif;

 function wizard_step () {

    wp_enqueue_style('oma_vue_ui','https://unpkg.com/element-ui/lib/theme-chalk/index.css',array(), '1.1', 'all');
    wp_enqueue_style('oma_vue_fontawesome','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',array(), '1.1', 'all');
    wp_enqueue_style('oma_css',plugin_dir_url(__FILE__).'main.css',array(), '1.1', 'all');

    wp_enqueue_script('oma_vue','https://cdn.jsdelivr.net/npm/vue/dist/vue.js',array ('jquery'), 1.1, true);
    wp_enqueue_script('oma_vue_ui','https://unpkg.com/element-ui/lib/index.js',array ('jquery'), 1.1, true);
    wp_enqueue_script('oma_vue_local','//unpkg.com/element-ui/lib/umd/locale/en.js',array ('jquery'), 1.1, true);
    wp_enqueue_script('oma_vue_mask','https://cdnjs.cloudflare.com/ajax/libs/vue-the-mask/0.11.1/vue-the-mask.min.js',array ('jquery'), 1.1, true);
    wp_enqueue_script('oma_js_cities',plugin_dir_url(__FILE__).'/include/USCities.js',array ( 'jquery' ), 1.1, true);
    wp_enqueue_script('oma_js_household',plugin_dir_url(__FILE__).'/include/household.js',array ( 'jquery' ), 1.1, true);
    wp_enqueue_script('oma_js_coverage',plugin_dir_url(__FILE__).'/include/coverage.js',array ( 'jquery' ), 1.1, true);
    wp_enqueue_script('oma_js',plugin_dir_url(__FILE__).'main.js',array ( 'jquery' ), 1.1, true);
    wp_localize_script('oma_js','php_data',array(
       'contact_id' => _(get_field('contact_id','option'))
    ));

    ob_start();
    include(plugin_dir_path(__FILE__).'template.php');
    return ob_get_clean();
 }

 add_shortcode('wizard-step','wizard_step');