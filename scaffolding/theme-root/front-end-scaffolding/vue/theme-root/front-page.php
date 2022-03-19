<?php

// The front page template.
get_header();

?>

    <test-component>
        <main style="display: flex; justify-content: center;">
            <h1>Your scaffold theme!</h1>
        </main>
    </test-component>

<?php

the_content();

get_footer();
