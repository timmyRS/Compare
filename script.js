var table, cite, branch, known_branches = [], compare_points = [], open_solutions = [], known_solutions = [];

document.addEventListener("DOMContentLoaded", function()
{
	table = $("#table");
	$.ajax("branches").done(function(data)
	{
		known_branches = data;
		var select = $("#select-branch select");
		for(i in known_branches)
		{
			var option = document.createElement("option");
			option.value = known_branches[i];
			option.innerHTML = known_branches[i];
			select.append(option);
		}
		select.on("change", function()
		{
			location.hash = this.value;
			$(select.find("option")[0]).attr("selected", "selected").removeAttr("selected");
		});
		$("#select-solution select").on("change", function()
		{
			location.hash = branch + ":" + this.value;
			$($("#select-solution select option")[0]).attr("selected", "selected").removeAttr("selected");
		});
		$(window).on("hashchange", onHashChange);
		onHashChange();
	});
});

function loadBranch(branch_, callback)
{
	if(branch_ == "")
	{
		$("#select-branch").show();
		$("#select-solution").hide();
		location.hash = branch = "",
		compare_points = [],
		known_solutions = [];
		callback();
	}
	else
	{
		$("#select-branch").hide();
		$.ajax("./" + branch_ + "/").done(function(known_solutions_)
		{
			$.ajax("./" + branch_ + "/compare_points.json").done(function(compare_points_)
			{
				branch = branch_,
				compare_points = compare_points_,
				known_solutions = known_solutions_;
				$("#select-solution strong").html(branch);
				var select = $("#select-solution").find("select").html("<option></option>");
				for(i in known_solutions)
				{
					var option = document.createElement("option");
					option.value = i;
					option.innerHTML = known_solutions[i].name;
					select.append(option);
				}
				$("#select-solution").show();
				callback();
			});
		}).fail(function()
		{
			loadBranch("", callback);
		});
	}
}

function onHashChange()
{
	var arr = location.hash.toString().replace("#", "").split(":");
	if(arr.length > 0)
	{
		if(arr.length > 1)
		{
			open_solutions = arr[1].split(",");
			$("#start").hide();
		}
		else
		{
			open_solutions = [];
			$("#start").show();
			table.html("");
			$(".tooltip").remove();
		}
		if(branch != arr[0])
		{
			loadBranch(arr[0], function()
			{
				if(open_solutions.length > 0)
				{
					updateAddSolutionModal();
					compare(open_solutions);
				}
				else
				{
					table.html("");
				}
			});
		}
		else if(open_solutions.length > 0)
		{
			updateAddSolutionModal();
			compare(open_solutions);
		}
		else
		{
			table.html("");
		}
	}
}

function updateAddSolutionModal()
{
	$("#addSolutionModal .modal-body").html("<p></p>");
	for(i in known_solutions)
	{
		if(open_solutions.indexOf(i) == -1)
		{
			var a = document.createElement("a");
			a.href = "#" + branch + ":" + open_solutions.join(",") + "," + i;
			a.innerHTML = known_solutions[i].name;
			$("#addSolutionModal .modal-body p").append(a).append("<br>");
		}
	}
	if($("#addSolutionModal .modal-body").html() == "<p></p>")
	{
		$("#addSolutionModal .modal-body p").append("There is nothing left to be added. O.o");
	}
}

function removeSolution(id)
{
	var open_solutions_ = [];
	for(i in open_solutions)
	{
		if(i != id)
		{
			open_solutions_.push(open_solutions[i]);
		}
	}
	if(open_solutions_.length > 0)
	{
		location.hash = branch + ":" + open_solutions_.join(",");
	}
	else
	{
		location.hash = branch;
	}
	$(".tooltip").remove();
}

function compare(_solutions)
{
	var solutions = [], comparable = [], unknown = false;
	for(i in _solutions)
	{
		if(known_solutions[_solutions[i]] === undefined)
		{
			console.warn(_solutions[i] + " is unknown.");
			unknown = true;
		}
		else
		{
			solutions[_solutions[i]] = known_solutions[_solutions[i]];
		}
	}
	if(unknown)
	{
		if(Object.keys(solutions).length > 0)
		{
			location.hash = branch + ":" + Object.keys(solutions).join(",");
		}
		else
		{
			location.hash = branch;
		}
		return;
	}
	for(compare_point in compare_points)
	{
		if(compare_point != "points" && compare_point != "points_absolute")
		{
			var is_comparable = true;
			for(i in solutions)
			{
				if(solutions[i].compare_points[compare_point] === undefined)
				{
					is_comparable = false;
					break;
				}
			}
			if(is_comparable)
			{
				comparable.push(compare_point);
			}
		}
	}
	var thead = document.createElement("thead"), thead_html = "", tbody = document.createElement("tbody");
	thead_html = "<tr><th style='width:58px'><a href='#' onclick='event.preventDefault()' data-toggle='modal' data-target='#addSolutionModal' data-tooltip='tooltip' data-placement='right' title='Add Solution'><i class='fa fa-plus'></i></a>&nbsp;<a href='#"+branch+"' data-tooltip='tooltip' data-placement='right' title='Remove All Solutions'><i class='fa fa-ban'></i></a></th>";
	for(i in solutions)
	{
		thead_html += "<th><span>" + solutions[i].name + "</span> <a href='#' onclick='event.preventDefault();removeSolution(" + i + ")' data-tooltip='tooltip' data-placement='right' title='Remove Solution'><i class='fa fa-times'></i></a></th>";
		solutions[i].compare_points.points = {"info": 0};
		solutions[i].compare_points.points_absolute = {"info": 0};
		for(compare_point in solutions[i].compare_points)
		{
			switch(solutions[i].compare_points[compare_point].support)
			{
				case 0:
				solutions[i].compare_points.points_absolute.info += .5;
				break;

				case 1:
				solutions[i].compare_points.points_absolute.info++;
			}
		}
	}
	comparable.push("points");
	comparable.push("points_absolute");
	thead.innerHTML = thead_html + "</tr>";
	table.html("").append(thead);
	cite = 0;
	for(i in comparable)
	{
		var compare_point = comparable[i], tr = document.createElement("tr"), th = document.createElement("th");
		th.setAttribute("style", "border-bottom:#000 dotted;cursor:help");
		th.setAttribute("data-tooltip", "tooltip");
		th.setAttribute("data-placement", "right");
		th.setAttribute("title", compare_points[compare_point].desc);
		th.innerHTML = compare_points[compare_point].name;
		tr.appendChild(th);
		for(i in solutions)
		{
			tr.innerHTML += comparePointToTD(solutions[i].compare_points[compare_point]);
			if(solutions[i].compare_points[compare_point].support !== undefined)
			{
				switch(solutions[i].compare_points[compare_point].support)
				{
					case 0:
					solutions[i].compare_points.points.info += .5;
					break;

					case 1:
					solutions[i].compare_points.points.info++;
				}
			}
		}
		tbody.appendChild(tr);
	}
	table.append(tbody);
	$('[data-tooltip]:not([data-fixed])').tooltip().attr("data-fixed","fixed");
}

function comparePointToTD(data)
{
	var ret = "<td>";
	if(data.support !== undefined)
	{
		switch(data.support)
		{
			case -1:
			ret = "<td style='background:#dc3545'>";
			break;

			case 0:
			ret = "<td style='background:#ffc107'>"
			break;

			case 1:
			ret = "<td style='background:#28a745'>";
			break;

			default:
			console.warn("Invalid Support Value:", data.support);
		}
	}
	if(data.info !== undefined)
	{
		ret += data.info + " ";
	}
	if(data.cites !== undefined)
	{
		for(ci in data.cites)
		{
			ret += "<a class='cite' target='_blank' href='" + data.cites[ci] + "'>[" + (++cite) + "]</a>";
		}
	}
	return ret.trim() + "</td>";
}