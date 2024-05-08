using HSRM.CS.DistributedSystems.Hamster;
using System;
using System.ComponentModel;
using System.Text;
using CommandLine;

namespace HSRM.CS.DistributedSystems.Hamster
{
    class Program
    {
        static void ShowRtfm()
        {
            Console.WriteLine("Usage: hamster {<Option>} <param1> {<param2>}");
            Console.WriteLine("Function: Hamster management");
            Console.WriteLine("Verbs:");
            Console.WriteLine("     list {<owner>}                   - show current list of hamsters");
            Console.WriteLine("     add <owner> <hamster> [<treats>] - add new hamster");
            Console.WriteLine("     feed <owner> <hamster> <treats>  - feed treats to hamster");
            Console.WriteLine("     state <owner> <hamster>          - how is my hamster doing?");
            Console.WriteLine("     bill <owner>                     - the bill please!");
        }
    
        static void Main(string[] args){ 
            
            HamsterManagement hamManagement = new HamsterManagement();

            if (args.Length == 0)
            {
                ShowRtfm();
                Environment.Exit(2);
            }
            
            
          

    if ((args[0] != "list") && (args[0] != "add") && (args[0] != "feed") && (args[0] != "state") && (args[0] != "bill"))
    {
		ShowRtfm();
        Environment.Exit(2);
    }



    if (args[0] == "list"){
				if (!(args.Length < 3) ){
                    	ShowRtfm();
                   		Environment.Exit(2);
                	}
                if (args.Length == 1)
                {
                    var hamsters = hamManagement.Search();

                    if (!hamsters.Any())
                    {
                        Console.WriteLine("No hamsters matching criteria found");
                        Environment.Exit(2);
                    }

                    StringBuilder sOut = new StringBuilder("Owner\tName\tPrice\ttreats left\n");
                    foreach (var hamsterId in hamsters)
                    {
                        try
                        {
                            string maybeownerName, hamsterName;
                            short price;
                            short treatsleft = hamManagement.ReadEntry(hamsterId, out maybeownerName, out hamsterName,
                                out price);
                            sOut.AppendLine($"{maybeownerName}\t{hamsterName}\t{price} €\t{treatsleft}");

                        }

                        catch (Exceptions.HamsterNameTooLongException)
                        {
                            Console.WriteLine("Error: the specified name is too long");
                            Environment.Exit(2);
                        }

                        catch (Exceptions.HamsterNotFoundException)
                        {
                            Console.WriteLine("No hamsters matching criteria found");
                            Environment.Exit(2);
                        }
                    }

                    Console.WriteLine(sOut.ToString());
                    Environment.Exit(2);
                    ShowRtfm();
                }

                if (args.Length == 2){
                 
                    string maybeownerName = args[1];
                    if (maybeownerName.Length > 31)
                    {
                        Console.WriteLine("Error: the specified name is too long");
                        Environment.Exit(2);
                    }

                    var hamsters = hamManagement.Search(ownerName: maybeownerName);

                    if (!hamsters.Any())
                    {
                        Console.WriteLine("No hamsters matching criteria found");
                        Environment.Exit(2);
                    }

                    StringBuilder sOut = new StringBuilder("Owner\tName\tPrice\ttreats left\n");
                    foreach (var hamsterId in hamsters)
                    {
                        try
                        {
                            string hamsterName;
                            short price;
                            short treatsLeft = hamManagement.ReadEntry(hamsterId, out _, out hamsterName, out price);
                            sOut.AppendLine($"{maybeownerName}\t{hamsterName}\t{price} €\t{treatsLeft}");
                        }
                        catch (Exceptions.HamsterNameTooLongException)
                        {
                            Console.WriteLine("Error: the specified name is too long");
                            Environment.Exit(0);
                        }
                        catch (Exceptions.HamsterNotFoundException)
                        {
                            Console.WriteLine("No hamsters matching criteria found");
                            Environment.Exit(0);
                        }
                    }

                    Console.WriteLine(sOut.ToString());
                    Environment.Exit(2);
                    ShowRtfm();
                }
            }
    else if (args[0] == "add")
    {
       
        if (args.Length < 3 || args.Length > 4)
        {
            ShowRtfm();
            Environment.Exit(2);
        }
        if (args.Length == 3 || args.Length == 4)
        {
            string owner = args[1];
            string hamster = args[2];
            try
            {
                short treats = 0;
                if (args.Length == 4)
                {
                    if (!short.TryParse(args[3], out treats)) 
                    {
                        Console.WriteLine("Error: 'treats' should be a number.");
                        Environment.Exit(2);
                    }
                }

                hamManagement.NewHamster(owner, hamster, treats);
                Console.WriteLine("Done!");
            }
            catch (Exceptions.HamsterNameTooLongException)
            {
                Console.WriteLine("Error: the specified name is too long");
                Environment.Exit(2);
            }
            catch (Exceptions.HamsterExistsException)
            {
                Console.WriteLine("Error: a hamster by that owner/name already exists");
                Environment.Exit(2);
            }
        
            Environment.Exit(2);
            ShowRtfm();
        }
    }

            else if (args[0] == "feed")
            {
                if (args.Length == 4)
                {
                    string owner = args[1];
                    string hamster = args[2];
                    try
                    {
                        short treats;
                        if (!short.TryParse(args[3], out treats))
                        {
                            Console.WriteLine("Error: 'treats' should be a number.");
                            Environment.Exit(2); 
                        }

                        int hamsterId = hamManagement.Lookup(owner, hamster);
                        short remainingTreats = hamManagement.GiveTreats(hamsterId, treats);
                        Console.WriteLine($"Done! {remainingTreats} treats remaining in store");
                    }
                    catch (Exceptions.HamsterNameTooLongException)
                    {
                        Console.WriteLine("Error: the specified name is too long");
                        Environment.Exit(2);
                    }
                    catch (Exceptions.HamsterNotFoundException)
                    {
                        Console.WriteLine("Error: A hamster or hamster owner could not be found");
                        Environment.Exit(2);
                    }
                   
                }

                Environment.Exit(2);
                ShowRtfm();
            }
            else if (args[0] == "state")
            {
                if (args.Length == 3)
                {
                    var owner = args[1];
                    var hamster = args[2];
                    try
                    {
                        var id = hamManagement.Lookup(owner, hamster);
                        var state = hamManagement.Howsdoing(id);
                        int rounds = Convert.ToInt32(state.Rounds);
                        
                        Console.WriteLine(owner + "'s hamster " + hamster + " has done > " + rounds+
                                          "hamster wheel revolutions,");
                        Console.WriteLine("and has " + state.TreatsLeft + " treats left in store. Current price is " +
                                          state.Cost + " €");
                    }
                    catch (Exceptions.HamsterNameTooLongException)
                    {
                        Console.WriteLine("Error: the specified name is too long");
                        Environment.Exit(2);
                    }
                    catch (Exceptions.HamsterNotFoundException)
                    {
                        Console.WriteLine("Error: A hamster or hamster owner could not be found");
                        Environment.Exit(2);
                    }
                }

                Environment.Exit(2);
                ShowRtfm();
            }
            else if (args[0] == "bill")
            {
                if (args.Length == 2)
                {
                    String owner = args[1];
                    try
                    {
                        var cost = hamManagement.Collect(owner);
                        Console.WriteLine(owner + " has to pay " + cost + " € ");
                    }
                    catch (Exceptions.HamsterNameTooLongException)
                    {
                        Console.WriteLine("Error: the specified name is too long");
                        Environment.Exit(2);
                    }
                    catch (Exceptions.HamsterNotFoundException)
                    {
                        Console.WriteLine("Error: A hamster or hamster owner could not be found");
                        Environment.Exit(2);
                    }
                }

                Environment.Exit(2);
                ShowRtfm();
            }
        }
    }
}
