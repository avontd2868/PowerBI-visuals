//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;

namespace Microsoft.InfoNav.Build.Tasks
{
    public sealed class TsLint : Task
    {
        private static string SRC_DIR_NAME = "src";
        private static string TOOLS_DIR = @"tools";

        [Required]
        public ITaskItem[] TsSourceFiles { get; set; }

        [Required]
        public string TsLintRulesJson { get; set; }

        public override bool Execute()
        {
            try
            {
                return this.RunTask();
            }
            catch (Exception e)
            {
                Log.LogWarning("TSLINT EXCEPTION: " + e.Message);
            }

            return true;
        }

        private bool RunTask()
        {
            if (TsSourceFiles.Length == 0 || string.IsNullOrWhiteSpace(TsLintRulesJson))
                return true;

            // filter the list down to source files (not including d.ts declarations)
            var tsSourceList = TsSourceFiles.Where(f => !f.ItemSpec.EndsWith("d.ts")).Select(f =>
            {
                FileInfo tsFile = new FileInfo(f.ItemSpec);
                return " --file=" + tsFile.FullName;
            }).ToArray();

            if (tsSourceList.Length == 0)
            {
                Log.LogMessage("TsLint: No files to process");
                return true;
            }

            Log.LogMessage(MessageImportance.High, string.Format("TypeScript Linting Started for {0} file(s)...", tsSourceList.Length));

            Process tsLintProcess = CreateJsLintProcess(tsSourceList, TsLintRulesJson);
            tsLintProcess.StartInfo.RedirectStandardOutput = true;
            tsLintProcess.StartInfo.RedirectStandardError = true;
            tsLintProcess.StartInfo.CreateNoWindow = true;
            tsLintProcess.StartInfo.UseShellExecute = false;
            tsLintProcess.StartInfo.StandardOutputEncoding = Encoding.ASCII;

            tsLintProcess.OutputDataReceived += (sender, e) =>
            {
                if (e.Data != null)
                {
                    try
                    {
                        int rangeStart = e.Data.IndexOf("[");
                        int rangeEnd = e.Data.IndexOf("]");
                        int errorStart = e.Data.IndexOf(":", rangeEnd);
                        string errorPosition = e.Data.Substring(rangeStart + 1, rangeEnd - rangeStart - 1);

                        string fileName = e.Data.Substring(0, rangeStart).Trim();
                        string errorMessage = e.Data.Substring(errorStart + 1).Trim();
                        int line = int.Parse(errorPosition.Split(',')[0].Trim());
                        int column = int.Parse(errorPosition.Split(',')[1].Trim());

                        Log.LogError("", "", "", fileName, line, column, 0, 0, "TSLINT: " + errorMessage);
                    }
                    catch
                    {
                        Log.LogWarning(e.Data);
                    }
                }
            };

            tsLintProcess.Start();
            tsLintProcess.BeginOutputReadLine();

            if (!tsLintProcess.HasExited)
                tsLintProcess.WaitForExit();

            return !Log.HasLoggedErrors;
        }

        private static Process CreateJsLintProcess(string[] tsSourceFiles, string tsLintOptionsJsonLocation)
        {
            string nodeJsLocation = GetNodeJsLocation();
            string tsLintLocation = GetTsLintLocation();
            string tsLintCustomRulesLocation = GetTsLintCustomRulesLocation();

            Process tsLintProcess = new Process();
            tsLintProcess.StartInfo.FileName = nodeJsLocation;
            tsLintProcess.StartInfo.Arguments =
                string.Format(
                CultureInfo.InvariantCulture,
                "\"{0}\" -c {1} -r {2} -f {3}",
                tsLintLocation,
                tsLintOptionsJsonLocation,
                tsLintCustomRulesLocation,
                string.Join(" ", tsSourceFiles));

            return tsLintProcess;
        }

        private static string GetNodeJsLocation()
        {
            string nodeRelPath = string.Format(CultureInfo.InvariantCulture, @"TypeScript\node.exe");

            return GetPathToExternals(nodeRelPath);
        }

        private static string GetTsLintLocation()
        {
            string tslintRelPath = string.Format(CultureInfo.InvariantCulture, @"TsLint\bin\tslint-cli.js");

            return GetPathToExternals(tslintRelPath);
        }

        private static string GetTsLintCustomRulesLocation()
        {
            string tslintCustomRulesRelPath = string.Format(CultureInfo.InvariantCulture, @"TsLint\custom_rules");

            return GetPathToExternals(tslintCustomRulesRelPath);
        }

        private static string GetPathToExternals(string relativePath)
        {
            string currentDir = Directory.GetCurrentDirectory();
            DirectoryInfo dirInfo = new DirectoryInfo(currentDir);

            while ((dirInfo != null) && (dirInfo.Name.ToLower() != SRC_DIR_NAME))
            {
                dirInfo = dirInfo.Parent;
            }

            if (dirInfo == null)
            {
                throw new DirectoryNotFoundException("Directory containing TSLINT tools not found!");
            }

            //Tools directory is a peer of src; so go up one level
            return Path.GetFullPath(Path.Combine(dirInfo.Parent.FullName, TOOLS_DIR, relativePath));
        }
    }
}