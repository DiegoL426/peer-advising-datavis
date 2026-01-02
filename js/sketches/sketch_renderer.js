// sketch_renderer.js

// Responsible for rendering the main visualization based on the current active index
(function () {
    window.Renderer = {

        setData: function (manager) {
            var self = this;

            manager.offsetX = (manager.margin && manager.margin.left) || 20;
            // apply global horizontal shift if present
            manager.offsetX = manager.offsetX + (manager.shiftX || 0);
            manager.offsetY = (manager.margin && manager.margin.top) || 0;
            // apply global vertical shift if present
            manager.offsetY = manager.offsetY + (manager.shiftY || 0);

            function computeLayout(data) {
                manager.data = data;
            }

            let url = 'data/csvjson.json'
            fetch(url)
                .then(res => {return res.json();})
                .then(data => {
                    console.log(data);
                    computeLayout(data);
                })
                .catch(err => {console.error('Failed to fetch JSON:', err);});

            computeLayout([]);
            return Promise.resolve(manager.data);
        },

        draw: function (p, manager, ai, progress) {
            try { console.log('Renderer: delegating draw, ai=', ai); } catch (e) { }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            if (ai == 0) {
                window.VizBar.draw(p, manager, ai, progress);
                return;
            }

            if (ai == 1) {
                window.VizDash.draw(p, manager, ai, progress, cx, cy);
                return;
            }

            if (ai == 2) {
                window.VizPart2.draw(p, manager, ai, progress, cx, cy);
                return;
            }

        }
    };
})();
